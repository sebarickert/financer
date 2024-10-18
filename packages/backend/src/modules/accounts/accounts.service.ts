import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account, AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { AccountRepo } from '../../database/repos/account.repo';
import { PaginationDto } from '../../types/pagination.dto';
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
    limit = 20,
    page = 1,
  ): Promise<PaginationDto<AccountDto[]>> {
    const skip = page * limit - limit;

    const type = accountTypes ? { type: { in: accountTypes } } : {};
    const whereQuery = { userId, isDeleted: false, ...type };

    const accounts = await this.accountRepo.findMany({
      where: whereQuery,
      take: limit,
      skip,
    });

    const totalCount = await this.accountRepo.getCount({
      where: whereQuery,
    });

    const lastPage = page ? Math.ceil(totalCount / limit) : 1;

    return new PaginationDto({
      data: AccountDto.createFromPlain(accounts),
      currentPage: page ?? 1,
      limit: page ? limit : totalCount,
      totalPageCount: lastPage,
      hasNextPage: (page ?? 1) < lastPage,
      hasPreviousPage: (page ?? 1) > 1,
      totalRowCount: totalCount,
    });
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
        undefined,
        accountId,
      )
    ).data.map(({ amount, date, toAccount }) => ({
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
      }, [] as AccountBalanceHistoryDto[]);

    return AccountBalanceHistoryDto.createFromPlain(summarizedBalanceChanges);
  }
}
