import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaPromise,
  Transaction,
  TransactionType,
} from '@prisma/client';

import { PrismaService } from '../prisma.service';

import { DateService } from '@/utils/date.service';

@Injectable()
export class TransactionRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOne<T extends Prisma.TransactionFindUniqueArgs>(
    transactionWhereUniqueInput: T,
  ): Promise<Prisma.TransactionGetPayload<{ include: T['include'] }> | null> {
    // @ts-expect-error - Prisma is not able to infer the correct type for include
    return this.prisma.transaction.findUnique(transactionWhereUniqueInput);
  }

  async findMany<T extends Prisma.TransactionFindManyArgs>(
    params: T,
  ): Promise<
    Prisma.TransactionGetPayload<{
      include: T['include'];
      select: T['select'];
    }>[]
  > {
    // @ts-expect-error - Prisma is not able to infer the correct type for include
    return this.prisma.transaction.findMany(params);
  }

  async getCount(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionWhereUniqueInput;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }): Promise<number> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.transaction.count({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        // E2e db does not set default values for these fields so we have to set them manually
        toAccount: null,
        fromAccount: null,
        ...data,
      },
    });
  }

  createMany(
    data: Prisma.TransactionUncheckedCreateInput[],
  ): PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.transaction.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.TransactionWhereUniqueInput;
    data: Prisma.TransactionUpdateInput;
  }): Promise<Transaction> {
    const { where, data } = params;
    return this.prisma.transaction.update({
      data,
      where,
    });
  }

  async delete(
    where: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where,
    });
  }

  deleteMany(where: Prisma.TransactionWhereInput) {
    return this.prisma.transaction.deleteMany({
      where,
    });
  }

  static filterByType(
    transactionType: TransactionType | null,
  ): Prisma.TransactionWhereInput {
    switch (transactionType) {
      case TransactionType.INCOME:
        return {
          fromAccount: { equals: null },
          toAccount: { not: null },
        };
      case TransactionType.EXPENSE:
        return {
          fromAccount: { not: null },
          toAccount: { equals: null },
        };
      case TransactionType.TRANSFER:
        return {
          fromAccount: { not: null },
          toAccount: { not: null },
        };
      case null:
        return {};
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid transaction type: ${transactionType}`);
    }
  }

  static filterByYearAndMonth(
    year?: number,
    month?: number,
    filterMode: 'targetMonth' | 'laterThan' = 'targetMonth',
  ): Prisma.TransactionWhereInput {
    if (!year && month) {
      throw new BadRequestException('Year is required when month is provided');
    }

    if (!year && !month) {
      return {};
    }

    if (!year) {
      throw new BadRequestException('Year is required');
    }

    if (filterMode === 'laterThan') {
      const actualMonth = month ? month - 1 : 0;

      return {
        date: {
          gte: DateService.fromZonedTime(year, actualMonth, 1),
        },
      };
    }

    const actualStartMonth = month ? month - 1 : 0;
    const actualEndMonth = month ?? 12;

    return {
      date: {
        gte: DateService.fromZonedTime(year, actualStartMonth, 1),
        lt: DateService.fromZonedTime(year, actualEndMonth, 1),
      },
    };
  }

  static filterByAccount(
    accountId?: string | string[],
  ): Prisma.TransactionWhereInput {
    if (!accountId) {
      return {};
    }

    if (Array.isArray(accountId)) {
      if (accountId.length === 0) {
        return {};
      }

      return {
        OR: [
          {
            toAccount: { in: accountId },
          },
          {
            fromAccount: { in: accountId },
          },
        ],
      };
    }

    return {
      OR: [
        {
          toAccount: accountId,
        },
        {
          fromAccount: accountId,
        },
      ],
    };
  }

  static filterById(ids?: string[]): Prisma.TransactionWhereInput {
    const objectIds = ids?.map((id) => id) ?? [];

    return {
      id: {
        in: objectIds,
      },
    };
  }
}
