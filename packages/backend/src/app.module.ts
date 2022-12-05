import { join } from 'path';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';

import { configuration } from './config/configuration';
import { AccountBalanceChangesModule } from './modules/account-balance-changes/account-balance-changes.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { IncomesModule } from './modules/incomes/incomes.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TransactionCategoriesModule } from './modules/transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from './modules/transaction-category-mappings/transaction-category-mappings.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { UserDataModule } from './modules/user-data/user-data.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/health-check/*', '/api/*', '/auth/*', '/tasks/*'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbConnectionString'),
      }),
    }),
    AuthModule.register(),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    TransactionCategoriesModule,
    TransactionCategoryMappingsModule,
    UserDataModule,
    ExpensesModule,
    IncomesModule,
    TransfersModule,
    AccountBalanceChangesModule,
    HealthCheckModule,
    UserPreferencesModule,
    TasksModule,
  ],
})
export class AppModule implements NestModule {
  constructor(
    @InjectConnection() private mongooseConnection: mongoose.Connection,
    private configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: this.configService.get<string>('cookieKey'),
          cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
          },
          saveUninitialized: false,
          resave: false,
          store: MongoStore.create({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            client: this.mongooseConnection.getClient() as any,
            touchAfter: 60 * 60 * 24,
          }),
        }),
        cookieParser(),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
