import { Injectable } from '@nestjs/common';
import { AccountBalanceChange, Prisma, PrismaPromise } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class AccountBalanceChangeRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    accountBalanceChangeWhereUniqueInput: Prisma.AccountBalanceChangeWhereUniqueInput,
  ): Promise<AccountBalanceChange | null> {
    return this.prisma.accountBalanceChange.findUnique({
      where: accountBalanceChangeWhereUniqueInput,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountBalanceChangeWhereUniqueInput;
    where?: Prisma.AccountBalanceChangeWhereInput;
    orderBy?: Prisma.AccountBalanceChangeOrderByWithRelationInput;
  }): Promise<AccountBalanceChange[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.accountBalanceChange.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.AccountBalanceChangeCreateInput,
  ): Promise<AccountBalanceChange> {
    const { amount, date, user, account } = data;
    return this.prisma.accountBalanceChange.create({
      data: {
        amount,
        date,
        user,
        account,
      },
    });
  }

  createMany(
    data: Prisma.AccountBalanceChangeCreateManyInput[],
  ): PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.accountBalanceChange.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.AccountBalanceChangeWhereUniqueInput;
    data: Prisma.AccountBalanceChangeUpdateInput;
  }): Promise<AccountBalanceChange> {
    const { where, data } = params;
    const { amount, date, user, account } = data;
    return this.prisma.accountBalanceChange.update({
      data: {
        amount,
        date,
        user,
        account,
      },
      where,
    });
  }

  async delete(
    where: Prisma.AccountBalanceChangeWhereUniqueInput,
  ): Promise<AccountBalanceChange> {
    return this.prisma.accountBalanceChange.delete({
      where,
    });
  }

  deleteMany(where: Prisma.AccountBalanceChangeWhereInput) {
    return this.prisma.accountBalanceChange.deleteMany({
      where,
    });
  }
}
