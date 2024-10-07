import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TransactionTemplateLog,
  TransactionTemplateType,
} from '@prisma/client';

import { TransactionTemplateLogRepo } from '../../database/repos/transaction-template-log.repo';
import { TransactionTemplateRepo } from '../../database/repos/transaction-template.repo';
import { UserId } from '../../types/user-id';
import { DateService } from '../../utils/date.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';

import { CreateTransactionTemplateLogDto } from './dto/create-transaction-template-log.dto';
import { CreateTransactionTemplateDto } from './dto/create-transaction-template.dto';
import { TransactionTemplateDto } from './dto/transaction-template.dto';
import { UpdateTransactionTemplateDto } from './dto/update-transaction-template.dto';

@Injectable()
export class TransactionTemplatesService {
  constructor(
    private readonly transactionTemplateRepo: TransactionTemplateRepo,
    private readonly transactionTemplateLogRepo: TransactionTemplateLogRepo,
  ) {}

  async create(
    createTransactionTemplateDto: CreateTransactionTemplateDto,
    userId: UserId,
  ) {
    return this.transactionTemplateRepo.create({
      ...createTransactionTemplateDto,
      userId,
    });
  }

  async createMany(
    userId: UserId,
    createTransactionTemplateDto: CreateTransactionTemplateDto[],
  ) {
    return this.transactionTemplateRepo.createMany(
      // @ts-expect-error - remove legacy `v` from import data
      createTransactionTemplateDto.map(({ v, ...template }) => ({
        ...template,
        userId,
      })),
    );
  }

  async findAllByUser(userId: UserId) {
    return this.transactionTemplateRepo.findMany({ where: { userId } });
  }

  async findAllByUserForExport(userId: UserId) {
    const templates = await this.transactionTemplateRepo.findMany({
      where: { userId },
    });
    return TransactionTemplateDto.createFromPlain(templates);
  }

  async findAllByUserAndType(
    userId: UserId,
    templateType: TransactionTemplateType,
  ) {
    return this.transactionTemplateRepo.findMany({
      where: {
        userId,
        templateType: {
          has: templateType,
        },
      },
    });
  }

  async findOne(id: string, userId: UserId) {
    const template = await this.transactionTemplateRepo.findOne({ id, userId });

    if (!template) {
      throw new NotFoundException('Transaction template not found.');
    }

    return template;
  }

  async update(
    id: string,
    updateTransactionTemplateDto: UpdateTransactionTemplateDto,
    userId: UserId,
  ) {
    await this.findOne(id, userId);
    return this.transactionTemplateRepo.update({
      where: {
        id,
        userId,
      },
      data: updateTransactionTemplateDto,
    });
  }

  async findAutomatedTemplatesWithCreationDateBefore(
    dayOfMonth: number,
    dateOperator: 'equals' | 'gte' = 'equals',
  ) {
    return this.transactionTemplateRepo.findMany({
      where: {
        templateType: { has: TransactionTemplateType.AUTO },
        dayOfMonthToCreate: { [dateOperator]: dayOfMonth },
      },
    });
  }

  async remove(id: string, userId: UserId) {
    await this.findOne(id, userId);
    return this.transactionTemplateRepo.delete({ id, userId });
  }

  async removeAllByUser(userId: UserId) {
    await this.transactionTemplateLogRepo.deleteMany({ userId });
    await this.transactionTemplateRepo.deleteMany({ userId });
  }

  getTransactionFromTemplate(
    template: TransactionTemplateDto,
  ): CreateTransactionDto {
    const date = DateService.toZonedTime();

    // Set the date to the first day of the month so when we add month it won't skip month e.g. 31.01 + 1 month = 03.03
    date.setDate(1);

    if (template.dayOfMonth < template.dayOfMonthToCreate) {
      date.setMonth(date.getMonth() + 1);
    }

    if (DateService.getLastDayOfMonth(date) < template.dayOfMonth) {
      date.setDate(DateService.getLastDayOfMonth(date));
    } else {
      date.setDate(template.dayOfMonth);
    }

    const categoryAmount = template.amount.dividedBy(
      template.categories.length,
    );

    const categories = template.categories.map((category) => ({
      categoryId: category.toString(),
      amount: categoryAmount,
      description: null,
    }));

    return {
      fromAccount: template.fromAccount,
      toAccount: template.toAccount,
      amount: template.amount,
      description: template.description,
      date: DateService.fromZonedTime(date),
      categories,
    };
  }

  async createTemplateLogEntry(
    logItem: CreateTransactionTemplateLogDto,
  ): Promise<void> {
    await this.transactionTemplateLogRepo.create(logItem);
  }

  async findTemplateLogEntriesByTemplateIdsAndType(
    templateIds: string[],
    templateType: TransactionTemplateType,
  ): Promise<TransactionTemplateLog[]> {
    return this.transactionTemplateLogRepo.findMany({
      where: {
        templateId: { in: templateIds },
        eventType: templateType,
        executed: {
          gt: new Date(DateService.zonedNow() - 1000 * 60 * 60 * 60),
        }, // 2 months
      },
    });
  }
}
