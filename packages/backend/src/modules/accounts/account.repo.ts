import { Injectable } from '@nestjs/common';
import { Account, Prisma, PrismaPromise } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class AccountRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: accountWhereUniqueInput,
    });
  }

  async count(where: Prisma.AccountWhereInput): Promise<number> {
    return this.prisma.account.count({
      where,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }): Promise<Account[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.account.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getCount(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }): Promise<number> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.account.count({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    const {
      id,
      userId,
      name,
      type,
      balance,
      createdAt,
      updatedAt,
      isDeleted,
      currentDateBalance,
    } = data;
    return this.prisma.account.create({
      data: {
        id,
        userId,
        name,
        type,
        balance,
        createdAt,
        updatedAt,
        isDeleted,
        currentDateBalance,
      },
    });
  }

  createMany(
    data: Prisma.AccountUncheckedCreateInput[],
  ): PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.account.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.AccountUpdateInput;
  }): Promise<Account> {
    const { where, data } = params;
    const {
      id,
      userId,
      name,
      type,
      balance,
      createdAt,
      updatedAt,
      isDeleted,
      currentDateBalance,
    } = data as Prisma.AccountUncheckedUpdateInput;
    return this.prisma.account.update({
      data: {
        id,
        userId,
        name,
        type,
        balance,
        createdAt,
        updatedAt,
        isDeleted,
        currentDateBalance,
      },
      where,
    });
  }

  async delete(where: Prisma.AccountWhereUniqueInput): Promise<Account> {
    return this.prisma.account.delete({
      where,
    });
  }

  deleteMany(where: Prisma.AccountWhereInput) {
    return this.prisma.account.deleteMany({
      where,
    });
  }
}
