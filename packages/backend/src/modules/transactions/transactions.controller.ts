import { AccountType, SortOrder, TransactionType } from '@local/types';
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
  ApiTags,
} from '@nestjs/swagger';

import { ObjectId, parseObjectId } from '../../types/objectId';
import { ApiPaginatedDto } from '../../utils/pagination.decorator';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { TransactionMonthSummaryDto } from './dto/transaction-month-summary.dto';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('api/transactions')
@ApiTags('Transactions')
@ApiExtraModels(TransactionDto, TransactionMonthSummaryDto)
@LoggedIn()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiPaginatedDto(TransactionDto)
  async findAllByUser(
    @UserId() userId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query(
      'accountTypes',
      new ParseArrayPipe({ separator: '|', optional: true }),
    )
    accountTypes?: AccountType[],
    @Query(
      'sortOrder',
      new DefaultValuePipe(SortOrder.DESC),
      new ParseEnumPipe(SortOrder),
    )
    sortOrder?: SortOrder,
    @Query('parentTransactionCategory', ValidateEntityId)
    parentTransactionCategory?: ObjectId,
  ) {
    return this.transactionsService.findAllByUser(
      userId,
      TransactionType.ANY,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
      undefined,
      accountTypes || undefined,
      sortOrder || undefined,
      undefined,
      parentTransactionCategory,
    );
  }

  @Get('monthly-summaries')
  @ApiPaginatedDto(TransactionMonthSummaryDto)
  async findMonthlySummariesByUser(
    @UserId() userId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('limit') limit: number,
    @Query(
      'accountTypes',
      new ParseArrayPipe({ separator: '|', optional: true }),
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
    parentTransactionCategory?: ObjectId,
  ) {
    return this.transactionsService.findMonthlySummariesByUser(
      userId,
      TransactionType.ANY,
      limit,
      year,
      month,
      accountTypes,
      transactionCategories?.map((id) => parseObjectId(id)),
      parentTransactionCategory,
    );
  }

  @Get('/account/:id')
  @ApiPaginatedDto(TransactionDto)
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findAllByAccount(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) accountId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.transactionsService.findAllByUser(
      userId,
      TransactionType.ANY,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: TransactionDto,
    description: 'Return transaction by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionsService.findOne(userId, id);
  }
}
