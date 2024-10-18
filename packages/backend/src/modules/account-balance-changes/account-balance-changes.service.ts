import { Injectable } from '@nestjs/common';
import { AccountBalanceChange } from '@prisma/client';

import { AccountBalanceChangeRepo } from '../../database/repos/account-balance-change.repo';
import { UserId } from '../../types/user-id';

import { AccountBalanceChangeDto } from './dto/account-balance-change.dto';
import { CreateAccountBalanceChangeDto } from './dto/create-account-balance-change.dto';

@Injectable()
export class AccountBalanceChangesService {
  constructor(
    private readonly accountBalanceChangeRepo: AccountBalanceChangeRepo,
  ) {}

  async create(
    userId: UserId,
    { accountId, amount, date }: CreateAccountBalanceChangeDto,
  ): Promise<AccountBalanceChange> {
    return this.accountBalanceChangeRepo.create({
      amount: amount,
      date: date,
      user: {
        connect: { id: userId },
      },
      account: {
        connect: { id: accountId },
      },
    });
  }

  createMany(
    userId: UserId,
    createAccountBalanceChanges: CreateAccountBalanceChangeDto[],
  ) {
    return this.accountBalanceChangeRepo.createMany(
      // @ts-expect-error - remove legacy `v` from import data
      createAccountBalanceChanges.map(({ v, ...change }) => ({
        ...change,
        userId,
      })),
    );
  }

  async findAllByUser(userId: UserId): Promise<AccountBalanceChange[]> {
    return this.accountBalanceChangeRepo.findMany({ where: { userId } });
  }

  async findAllByUserForExport(
    userId: UserId,
  ): Promise<AccountBalanceChange[]> {
    const balanceChanges = await this.accountBalanceChangeRepo.findMany({
      where: { userId },
    });
    return AccountBalanceChangeDto.createFromPlain(balanceChanges);
  }

  async findAllByUserAndAccount(
    userId: UserId,
    accountId: string,
  ): Promise<AccountBalanceChange[]> {
    return this.accountBalanceChangeRepo.findMany({
      where: { userId, accountId },
    });
  }

  removeAllByUser(userId: UserId) {
    return this.accountBalanceChangeRepo.deleteMany({ userId });
  }
}
