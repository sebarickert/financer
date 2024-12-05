import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account, AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { AccountRepo } from '../../database/repos/account.repo';
import { UserId } from '../../types/user-id';
import { sumArrayItems } from '../../utils/arrays';
import { DateService } from '../../utils/date.service';
import { AccountBalanceChangesService } from '../account-balance-changes/account-balance-changes.service';
import { TransactionsService } from '../transactions/transactions.service';

import { AccountBalanceHistoryDto } from './dto/account-balance-history.dto';
import { AccountDto } from './dto/account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountRepo: AccountRepo,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    private readonly accountBalanceChangeService: AccountBalanceChangesService,
  ) {}

  async create(
    userId: UserId,
    createAccountDto: CreateAccountDto,
  ): Promise<AccountDto> {
    const account = await this.accountRepo.create({
      ...createAccountDto,
      userId,
    });

    return AccountDto.createFromPlain(account);
  }

  createMany(userId: UserId, createAccountDto: CreateAccountDto[]) {
    return this.accountRepo.createMany(
      // @ts-expect-error - remove legacy `v` from import data
      createAccountDto.map(({ v, ...account }) => ({ ...account, userId })),
    );
  }

  // TODO: Clean this mess up, have to figure out a better way to get current date balance
  async findOne(userId: UserId, id: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ id, userId });

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    const accountBalanceChanges = (
      await this.accountBalanceChangeService.findAllByUserAndAccount(
        userId,
        account.id,
      )
    ).map(({ amount, date }) => ({ amount, date }));

    const accountTransactions = (
      await this.transactionsService.findAllByUser(
        userId,
        null,
        undefined,
        undefined,
        undefined,
        account.id,
      )
    ).map(({ amount, date, toAccount }) => ({
      date,
      amount: account.id === toAccount ? amount : amount.negated(),
    }));

    const allBalanceChanges = accountBalanceChanges.concat(accountTransactions);

    const summarizedBalanceChanges = allBalanceChanges
      .reduce(
        (previous, { date }) =>
          previous.some((d) => d.getTime() === date.getTime())
            ? previous
            : previous.concat(date),
        [] as Date[],
      )
      .sort((a, b) => b.getTime() - a.getTime())
      .map((date) => {
        const balanceChangeAmounts = allBalanceChanges
          .filter(({ date: itemDate }) => itemDate.getTime() === date.getTime())
          .map(({ amount }) => amount);

        return {
          date,
          amount: sumArrayItems(balanceChangeAmounts),
        };
      })
      .reduce((previous, { date, amount }) => {
        const previousBalance = previous.at(-1)?.balance ?? account.balance;

        const previousAmount = previous.at(-1)?.amount ?? 0;

        const newBalance = previousBalance.minus(previousAmount);

        return previous.concat({
          date,
          amount,
          balance: newBalance,
        });
      }, [] as AccountBalanceHistoryDto[])
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const pastTransactions = summarizedBalanceChanges.filter(
      (transaction) => new Date(transaction.date) <= new Date(),
    );

    const latestTransaction = pastTransactions.reduce((latest, transaction) => {
      return new Date(transaction.date) > new Date(latest.date)
        ? transaction
        : latest;
    }, pastTransactions[0]);

    const refinedAccount = {
      ...account,
      currentDateBalance: latestTransaction?.balance,
    };

    return AccountDto.createFromPlain(refinedAccount);
  }

  async findAllByUser(
    userId: UserId,
    accountTypes?: AccountType[],
  ): Promise<AccountDto[]> {
    const type = accountTypes?.length > 0 ? { type: { in: accountTypes } } : {};
    const whereQuery = { userId, isDeleted: false, ...type };

    const accounts = await this.accountRepo.findMany({
      where: whereQuery,
    });

    const currentDateBalances = await Promise.all(
      accounts.map(async ({ id }) => {
        const currentDateBalance = await this.getCurrentDateAccountBalance(
          userId,
          id,
        );

        return { id, currentDateBalance };
      }),
    );

    const refinedAccounts = accounts.map((account) => {
      const currentBalance = currentDateBalances.find(
        (balance) => balance.id === account.id,
      );
      return {
        ...account,
        ...currentBalance,
      };
    });

    return AccountDto.createFromPlain(refinedAccounts);
  }

  async findAllByUserForExport(userId: UserId): Promise<AccountDto[]> {
    const accounts = await this.accountRepo.findMany({ where: { userId } });
    return AccountDto.createFromPlain(accounts);
  }

  async update(
    userId: UserId,
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDto> {
    const accountBeforeChange = await this.findOne(userId, id);

    if (
      updateAccountDto.balance &&
      updateAccountDto.balance !== accountBeforeChange.balance
    ) {
      const balanceChangeAmount = updateAccountDto.balance.minus(
        accountBeforeChange.balance,
      );
      await this.accountBalanceChangeService.create(userId, {
        accountId: id,
        amount: balanceChangeAmount,
        date: DateService.fromZonedTime(),
      });
    }

    const account = await this.accountRepo.update({
      where: { userId, id },
      data: updateAccountDto,
    });

    return AccountDto.createFromPlain(account);
  }

  async updateBalance(
    userId: UserId,
    id: string,
    amount: Decimal,
  ): Promise<Account> {
    await this.findOne(userId, id);

    return this.accountRepo.update({
      where: { userId, id },
      data: { balance: { increment: amount } },
    });
  }

  async remove(id: string, userId: UserId) {
    await this.findOne(userId, id);
    await this.accountRepo.update({
      where: { id, userId },
      data: { isDeleted: true },
    });
  }

  removeAllByUser(userId: UserId) {
    return this.accountRepo.deleteMany({ userId });
  }

  async getCurrentDateAccountBalance(
    userId: UserId,
    accountId: string,
  ): Promise<Decimal> {
    const currentDateBalance = await this.getAccountBalanceHistory(
      userId,
      accountId,
    );

    const pastTransactions = currentDateBalance.filter(
      (transaction) => new Date(transaction.date) <= new Date(),
    );

    const latestTransaction = pastTransactions.reduce((latest, transaction) => {
      return new Date(transaction.date) > new Date(latest.date)
        ? transaction
        : latest;
    }, pastTransactions[0]);

    return latestTransaction?.balance;
  }

  async getAccountBalanceHistory(
    userId: UserId,
    accountId: string,
  ): Promise<AccountBalanceHistoryDto[]> {
    const account = await this.findOne(userId, accountId);

    const accountBalanceChanges = (
      await this.accountBalanceChangeService.findAllByUserAndAccount(
        userId,
        accountId.toString(),
      )
    ).map(({ amount, date }) => ({ amount, date }));

    const accountTransactions = (
      await this.transactionsService.findAllByUser(
        userId,
        null,
        undefined,
        undefined,
        undefined,
        accountId,
      )
    ).map(({ amount, date, toAccount }) => ({
      date,
      amount: accountId === toAccount ? amount : amount.negated(),
    }));

    const allBalanceChanges = accountBalanceChanges.concat(accountTransactions);

    const summarizedBalanceChanges = allBalanceChanges
      .reduce(
        (previous, { date }) =>
          previous.some((d) => d.getTime() === date.getTime())
            ? previous
            : previous.concat(date),
        [] as Date[],
      )
      .sort((a, b) => b.getTime() - a.getTime())
      .map((date) => {
        const balanceChangeAmounts = allBalanceChanges
          .filter(({ date: itemDate }) => itemDate.getTime() === date.getTime())
          .map(({ amount }) => amount);

        return {
          date,
          amount: sumArrayItems(balanceChangeAmounts),
        };
      })
      .reduce((previous, { date, amount }) => {
        const previousBalance = previous.at(-1)?.balance ?? account.balance;

        const previousAmount = previous.at(-1)?.amount ?? 0;

        const newBalance = previousBalance.minus(previousAmount);

        return previous.concat({
          date,
          amount,
          balance: newBalance,
        });
      }, [] as AccountBalanceHistoryDto[])
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return AccountBalanceHistoryDto.createFromPlain(summarizedBalanceChanges);
  }
}
