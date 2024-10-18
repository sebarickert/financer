import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, TransactionCategory } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionCategoryRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    transactionCategoryWhereUniqueInput: Prisma.TransactionCategoryWhereUniqueInput,
  ): Promise<TransactionCategory | null> {
    return this.prisma.transactionCategory.findUnique({
      where: transactionCategoryWhereUniqueInput,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionCategoryWhereUniqueInput;
    where?: Prisma.TransactionCategoryWhereInput;
    orderBy?: Prisma.TransactionCategoryOrderByWithRelationInput;
  }): Promise<TransactionCategory[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transactionCategory.findMany({
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
    cursor?: Prisma.TransactionCategoryWhereUniqueInput;
    where?: Prisma.TransactionCategoryWhereInput;
    orderBy?: Prisma.TransactionCategoryOrderByWithRelationInput;
  }): Promise<number> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transactionCategory.count({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.TransactionCategoryUncheckedCreateInput,
  ): Promise<TransactionCategory> {
    return this.prisma.transactionCategory.create({
      data,
    });
  }

  createMany(
    data: Prisma.TransactionCategoryUncheckedCreateInput[],
  ): PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.transactionCategory.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.TransactionCategoryWhereUniqueInput;
    data: Prisma.TransactionCategoryUpdateInput;
  }): Promise<TransactionCategory> {
    const { where, data } = params;
    return this.prisma.transactionCategory.update({
      data,
      where,
    });
  }

  async delete(
    where: Prisma.TransactionCategoryWhereUniqueInput,
  ): Promise<TransactionCategory> {
    return this.prisma.transactionCategory.delete({
      where,
    });
  }

  deleteMany(where: Prisma.TransactionCategoryWhereInput) {
    return this.prisma.transactionCategory.deleteMany({
      where,
    });
  }
}
