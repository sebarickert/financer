import { Injectable } from '@nestjs/common';
import { SystemLogLevel, TransactionTemplateType } from '@prisma/client';

import { SystemService } from '@/system/system.service';
import { TransactionTemplateDto } from '@/transaction-templates/dto/transaction-template.dto';
import { TransactionTemplatesService } from '@/transaction-templates/transaction-templates.service';
import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto';
import { TransactionsService } from '@/transactions/transactions.service';
import { DateService } from '@/utils/date.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly templateService: TransactionTemplatesService,
    private readonly transactionsService: TransactionsService,
    private readonly systemService: SystemService,
  ) {}

  // eslint-disable-next-line max-lines-per-function
  async generateTransactions() {
    const now = new Date();
    const dayOfMonth = now.getDate();

    const templates =
      await this.templateService.findAutomatedTemplatesWithCreationDateBefore(
        dayOfMonth,
        dayOfMonth < DateService.getLastDayOfMonth() ? 'equals' : 'gte',
      );

    const templateLogEntries =
      await this.templateService.findTemplateLogEntriesByTemplateIdsAndType(
        templates.map((template) => template.id),
        TransactionTemplateType.AUTO,
      );

    const result = await Promise.all(
      // eslint-disable-next-line max-statements
      templates.map(async (template) => {
        if (!template.amount || !template.description) return 'missingData';

        const hasAddedTransactionThisMonth = templateLogEntries.some(
          (entry) => {
            if (entry.templateId !== template.id) return false;

            const entryDate = new Date(entry.executed);
            return DateService.isSameYearMonth(entryDate, now);
          },
        );

        if (hasAddedTransactionThisMonth) return 'skipped';

        const templateDto = TransactionTemplateDto.createFromPlain(template);

        // eslint-disable-next-line init-declarations
        let transactionData: CreateTransactionDto;

        try {
          transactionData =
            this.templateService.getTransactionFromTemplate(templateDto);
        } catch {
          return 'missingData';
        }

        const { userId } = templateDto;

        const transaction = await this.transactionsService.create(
          userId,
          transactionData,
        );

        await this.templateService.createTemplateLogEntry({
          templateId: template.id,
          transactionId: transaction.id.toString(),
          executed: now,
          userId,
          eventType: TransactionTemplateType.AUTO,
        });

        return 'added';
      }),
    );

    const output = result.reduce(
      (acc, curr) => {
        if (curr === 'skipped') {
          acc.skipped += 1;
        } else if (curr === 'missingData') {
          acc.missingData += 1;
        } else {
          acc.added += 1;
        }

        return acc;
      },
      { skipped: 0, added: 0, missingData: 0 },
    );

    await this.systemService.createSystemLogEntry({
      module: 'tasks',
      service: 'generateTransactions',
      message: `Added ${output.added} transactions, skipped ${output.skipped} and found ${output.missingData} templates with missing data`,
      level: SystemLogLevel.INFO,
    });

    return output;
  }
}
