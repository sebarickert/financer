import { Injectable } from '@nestjs/common';
import { AccountBalanceChange } from '@prisma/client';

import { AccountBalanceChangeDto } from './dto/account-balance-change.dto';
import { CreateAccountBalanceChangeDto } from './dto/create-account-balance-change.dto';

import { AccountBalanceChangeRepo } from '@/database/repos/account-balance-change.repo';
import { UserId } from '@/types/user-id';

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
      amount,
      date,
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
      createAccountBalanceChanges.map((change) => ({
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
  ): Promise<AccountBalanceChangeDto[]> {
    const balanceChanges = await this.accountBalanceChangeRepo.findMany({
      where: { userId },
    });
    return AccountBalanceChangeDto.createFromPlain(balanceChanges);
  }

  async findAllByUserAndAccount(
    userId: UserId,
    accountId: string,
    includePastBalanceChanges = true,
  ): Promise<AccountBalanceChange[]> {
    return this.accountBalanceChangeRepo.findMany({
      where: {
        userId,
        accountId,
        date: includePastBalanceChanges ? undefined : { gte: new Date() },
      },
    });
  }

  removeAllByUser(userId: UserId) {
    return this.accountBalanceChangeRepo.deleteMany({ userId });
  }
}
