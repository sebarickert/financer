import { Injectable } from '@nestjs/common';
import { Prisma, TransactionCategoryMapping } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionCategoryMappingRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    transactionCategoryMappingWhereUniqueInput: Prisma.TransactionCategoryMappingWhereUniqueInput,
  ): Promise<TransactionCategoryMapping | null> {
    return this.prisma.transactionCategoryMapping.findUnique({
      where: transactionCategoryMappingWhereUniqueInput,
    });
  }

  async findMany<T extends Prisma.TransactionCategoryMappingFindManyArgs>(
    params: T,
  ): Promise<
    Prisma.TransactionCategoryMappingGetPayload<{ include: T['include'] }>[]
  > {
    // @ts-expect-error - Prisma is not able to infer the correct type for include
    return this.prisma.transactionCategoryMapping.findMany(params);
  }

  async getCount(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionCategoryMappingWhereUniqueInput;
    where?: Prisma.TransactionCategoryMappingWhereInput;
    orderBy?: Prisma.TransactionCategoryMappingOrderByWithRelationInput;
  }): Promise<number> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transactionCategoryMapping.count({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.TransactionCategoryMappingUncheckedCreateInput,
  ): Promise<TransactionCategoryMapping> {
    return this.prisma.transactionCategoryMapping.create({
      data,
    });
  }

  async createMany(
    data: Prisma.TransactionCategoryMappingUncheckedCreateInput[],
  ): Promise<void> {
    if (data.length === 0) {
      return Promise.resolve();
    }

    await this.prisma.transactionCategoryMapping.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.TransactionCategoryMappingWhereUniqueInput;
    data: Prisma.TransactionCategoryMappingUpdateInput;
  }): Promise<TransactionCategoryMapping> {
    const { where, data } = params;
    return this.prisma.transactionCategoryMapping.update({
      data,
      where,
    });
  }

  async delete(
    where: Prisma.TransactionCategoryMappingWhereUniqueInput,
  ): Promise<TransactionCategoryMapping> {
    return this.prisma.transactionCategoryMapping.delete({
      where,
    });
  }

  async deleteMany(
    where: Prisma.TransactionCategoryMappingWhereInput,
  ): Promise<void> {
    await this.prisma.transactionCategoryMapping.deleteMany({
      where,
    });
  }
}
