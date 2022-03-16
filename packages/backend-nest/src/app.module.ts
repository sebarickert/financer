import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';

import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { TransactionCategoriesModule } from './transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from './transaction-category-mappings/transaction-category-mappings.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbConnectionString'),
      }),
    }),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    TransactionCategoriesModule,
    TransactionCategoryMappingsModule,
    AuthModule,
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
      )
      .forRoutes('*');
  }
}
