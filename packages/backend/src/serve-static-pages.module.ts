import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/accounts/[accountId]'),
      serveRoot: '/accounts/:id',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/profile/transaction-categories/[categoryId]',
      ),
      serveRoot: '/profile/transaction-categories/:id',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/profile/transaction-templates/[templateId]',
      ),
      serveRoot: '/profile/transaction-templates/:id',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/statistics/expenses/[expenseId]'),
      serveRoot: '/statistics/expenses/:id',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/statistics/incomes/[incomeId]'),
      serveRoot: '/statistics/incomes/:id',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/statistics/transfers/[transferId]',
      ),
      serveRoot: '/statistics/transfers/:id',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/health-check/*', '/api/*', '/auth/*'],
    }),
  ],
})
export class ServeStaticPagesModule {}
