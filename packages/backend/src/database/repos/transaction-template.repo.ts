import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, TransactionTemplate } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionTemplateRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    transactionTemplateWhereUniqueInput: Prisma.TransactionTemplateWhereUniqueInput,
  ): Promise<TransactionTemplate | null> {
    return this.prisma.transactionTemplate.findUnique({
      where: transactionTemplateWhereUniqueInput,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionTemplateWhereUniqueInput;
    where?: Prisma.TransactionTemplateWhereInput;
    orderBy?: Prisma.TransactionTemplateOrderByWithRelationInput;
  }): Promise<TransactionTemplate[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transactionTemplate.findMany({
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
    cursor?: Prisma.TransactionTemplateWhereUniqueInput;
    where?: Prisma.TransactionTemplateWhereInput;
    orderBy?: Prisma.TransactionTemplateOrderByWithRelationInput;
  }): Promise<number> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transactionTemplate.count({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.TransactionTemplateUncheckedCreateInput,
  ): Promise<TransactionTemplate> {
    return this.prisma.transactionTemplate.create({
      data,
    });
  }

  createMany(
    data: Prisma.TransactionTemplateUncheckedCreateInput[],
  ): PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.transactionTemplate.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.TransactionTemplateWhereUniqueInput;
    data: Prisma.TransactionTemplateUpdateInput;
  }): Promise<TransactionTemplate> {
    const { where, data } = params;
    return this.prisma.transactionTemplate.update({
      data,
      where,
    });
  }

  async delete(
    where: Prisma.TransactionTemplateWhereUniqueInput,
  ): Promise<TransactionTemplate> {
    return this.prisma.transactionTemplate.delete({
      where,
    });
  }

  deleteMany(where: Prisma.TransactionTemplateWhereInput) {
    return this.prisma.transactionTemplate.deleteMany({
      where,
    });
  }
}
