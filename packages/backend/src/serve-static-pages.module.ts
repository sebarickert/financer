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
      rootPath: join(__dirname, '..', 'client/settings/categories/add'),
      serveRoot: '/settings/categories/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'client/settings/categories/[categoryId]',
      ),
      serveRoot: '/settings/categories/:id',
    }),

    // Transaction templates dynamic paths
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/settings/templates/add'),
      serveRoot: '/settings/templates/add',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/settings/templates/[templateId]'),
      serveRoot: '/settings/templates/:id',
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
