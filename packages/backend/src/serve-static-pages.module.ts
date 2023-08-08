import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    // Accounts dynamic paths
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/accounts/add'),
      serveRoot: '/accounts/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/accounts/[accountId]'),
      serveRoot: '/accounts/:id',
    }),

    // Transaction categories dynamic paths
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/profile/transaction-categories/add',
      ),
      serveRoot: '/profile/transaction-categories/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/profile/transaction-categories/[categoryId]',
      ),
      serveRoot: '/profile/transaction-categories/:id',
    }),

    // Transaction templates dynamic paths
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/profile/transaction-templates/add',
      ),
      serveRoot: '/profile/transaction-templates/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/profile/transaction-templates/[templateId]',
      ),
      serveRoot: '/profile/transaction-templates/:id',
    }),

    // Expense dynamic paths
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/statistics/expenses/add'),
      serveRoot: '/statistics/expenses/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/statistics/expenses/[expenseId]'),
      serveRoot: '/statistics/expenses/:id',
    }),

    // Income dynamic paths
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/statistics/incomes/add'),
      serveRoot: '/statistics/incomes/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/statistics/incomes/[incomeId]'),
      serveRoot: '/statistics/incomes/:id',
    }),

    // Transfer dynamic paths
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/statistics/transfers/add'),
      serveRoot: '/statistics/transfers/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/statistics/transfers/[transferId]',
      ),
      serveRoot: '/statistics/transfers/:id',
    }),

    // Serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/health-check/*', '/api/*', '/auth/*'],
    }),
  ],
})
export class ServeStaticPagesModule {}
