import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Account, AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { AccountBalanceHistoryDto } from './dto/account-balance-history.dto';
import { AccountDto } from './dto/account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

import { AccountBalanceChangesService } from '@/account-balance-changes/account-balance-changes.service';
import { AccountRepo } from '@/database/repos/account.repo';
import { TransactionsService } from '@/transactions/transactions.service';
import { UserId } from '@/types/user-id';
import { sumArrayItems } from '@/utils/arrays';
import { DateService } from '@/utils/date.service';
import { sortDateDesc } from '@/utils/sort-helper';

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
      createAccountDto.map((account) => ({ ...account, userId })),
    );
  }

  async hasAccounts(userId: UserId) {
    const accountCount = await this.accountRepo.count({ userId });

    return accountCount > 0;
  }

  async findOneWithCurrentBalance(
    userId: UserId,
    id: string,
  ): Promise<Account> {
    const account = await this.findOne(userId, id);

    const currentDateBalance = await this.getCurrentDateAccountBalance(
      userId,
      account,
    );

    const refinedAccount = {
      ...account,
      currentDateBalance,
    };

    return AccountDto.createFromPlain(refinedAccount);
  }

  async findOne(userId: UserId, id: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ id, userId });

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    return AccountDto.createFromPlain(account);
  }

  async findAllByUser(
    userId: UserId,
    accountTypes?: AccountType[],
  ): Promise<AccountDto[]> {
    const type =
      accountTypes && accountTypes.length > 0
        ? { type: { in: accountTypes } }
        : {};

    const whereQuery = { userId, isDeleted: false, ...type };

    const accounts = await this.accountRepo.findMany({
      where: whereQuery,
    });

    const currentDateBalances = await Promise.all(
      accounts.map(async (account) => {
        const currentDateBalance = await this.getCurrentDateAccountBalance(
          userId,
          account,
        );

        return { id: account.id, currentDateBalance };
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
    account: Account,
  ): Promise<Decimal | null> {
    const upcomingBalanceChanges = await this.getAccountBalanceHistory(
      userId,
      account,
      false,
    );

    const latestTransaction = upcomingBalanceChanges.at(0);

    return latestTransaction?.balance.minus(latestTransaction.amount) ?? null;
  }

  async getAccountBalanceHistory(
    userId: UserId,
    account: Account,
    includePastBalanceChanges = true,
  ): Promise<AccountBalanceHistoryDto[]> {
    const accountBalanceChanges = (
      await this.accountBalanceChangeService.findAllByUserAndAccount(
        userId,
        account.id,
        includePastBalanceChanges,
      )
    ).map(({ amount, date }) => ({ amount, date }));

    const accountTransactions = (
      await this.transactionsService.findTransactionSummariesByUserAccount(
        userId,
        account.id,
        includePastBalanceChanges,
      )
    ).map(({ amount, date, toAccount }) => ({
      date,
      amount: account.id === toAccount ? amount : amount.negated(),
    }));

    const allBalanceChanges = accountBalanceChanges.concat(accountTransactions);

    const summarizedBalanceChanges = allBalanceChanges
      .reduce<Date[]>(
        (previous, { date }) =>
          previous.some((itemDate) => itemDate.getTime() === date.getTime())
            ? previous
            : previous.concat(date),
        [],
      )
      .sort(sortDateDesc)
      .map((date) => {
        const balanceChangeAmounts = allBalanceChanges
          .filter(({ date: itemDate }) => itemDate.getTime() === date.getTime())
          .map(({ amount }) => amount);

        return {
          date,
          amount: sumArrayItems(balanceChangeAmounts),
        };
      })
      .reduce<AccountBalanceHistoryDto[]>((previous, { date, amount }) => {
        const previousBalance = previous.at(-1)?.balance ?? account.balance;

        const previousAmount = previous.at(-1)?.amount ?? 0;

        const newBalance = previousBalance.minus(previousAmount);

        return previous.concat({
          date,
          amount,
          balance: newBalance,
        });
      }, [])
      .sort(sortDateDesc('date'));

    return AccountBalanceHistoryDto.createFromPlain(summarizedBalanceChanges);
  }
}
