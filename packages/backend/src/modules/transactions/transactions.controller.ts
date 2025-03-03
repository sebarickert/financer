import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseArrayPipe,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccountType, Prisma } from '@prisma/client';

import { TransactionDetailsDto } from './dto/transaction-details.dto';
import { TransactionListItemDto } from './dto/transaction-list-item.dto';
import { TransactionMonthSummaryDto } from './dto/transaction-month-summary.dto';
import { TransactionsService } from './transactions.service';

import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserIdDecorator } from '@/users/users.decorators';
import { ValidateArrayPipe } from '@/utils/validate-array.pipe';
import { ValidateEntityId } from '@/utils/validate-entity-id.pipe';
import { ValidateEnumPipe } from '@/utils/validate-enum.pipe';

@Controller('api/transactions')
@ApiTags('Transactions')
@ApiExtraModels(TransactionListItemDto, TransactionMonthSummaryDto)
@LoggedIn()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOkResponse({ type: TransactionListItemDto, isArray: true })
  @ApiQuery({
    name: 'month',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'accountTypes',
    required: false,
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: Prisma.SortOrder,
    enumName: 'SortOrder',
  })
  @ApiQuery({
    name: 'parentTransactionCategory',
    required: false,
    type: String,
  })
  async findAllByUser(
    @UserIdDecorator() userId: UserId,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('limit') limit?: number,
    @Query(
      'accountTypes',
      new ValidateArrayPipe('|', true),
      new ValidateEnumPipe(AccountType),
    )
    accountTypes?: AccountType[],
    @Query('accountId', ValidateEntityId) accountId?: string,
    @Query(
      'sortOrder',
      new DefaultValuePipe(Prisma.SortOrder.desc),
      new ParseEnumPipe(Prisma.SortOrder),
    )
    sortOrder?: Prisma.SortOrder,
    @Query('parentTransactionCategory', ValidateEntityId)
    parentTransactionCategory?: string,
  ) {
    return this.transactionsService.findAllByUser(
      userId,
      null,
      limit ?? undefined,
      year ?? undefined,
      month ?? undefined,
      accountId,
      accountTypes ?? undefined,
      sortOrder ?? undefined,
      undefined,
      parentTransactionCategory,
    );
  }

  @Get('monthly-summaries')
  @ApiOkResponse({
    type: TransactionMonthSummaryDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'month',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    required: false,
  })
  @ApiQuery({
    name: 'accountTypes',
    required: false,
  })
  @ApiQuery({
    name: 'transactionCategories',
    required: false,
  })
  @ApiQuery({
    name: 'parentTransactionCategory',
    required: false,
    type: String,
  })
  async findMonthlySummariesByUser(
    @UserIdDecorator() userId: UserId,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query(
      'accountTypes',
      new ValidateArrayPipe('|', true),
      new ValidateEnumPipe(AccountType),
    )
    accountTypes?: AccountType[],
    @Query(
      'transactionCategories',
      new ParseArrayPipe({
        separator: '|',
        optional: true,
      }),
    )
    transactionCategories?: string[],
    @Query('parentTransactionCategory', ValidateEntityId)
    parentTransactionCategory?: string,
  ) {
    return this.transactionsService.findMonthlySummariesByUser(
      userId,
      year,
      month,
      accountTypes,
      transactionCategories,
      parentTransactionCategory,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: TransactionDetailsDto,
    description: 'Return transaction by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findOne(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.transactionsService.findOne(userId, id);
  }
}
