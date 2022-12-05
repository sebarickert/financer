import { AccountType } from '@local/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { ObjectId, parseObjectId } from '../../types/objectId';
import { ApiPaginatedDto } from '../../utils/pagination.decorator';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { TransactionMonthSummaryDto } from '../transactions/dto/transaction-month-summary.dto';
import { UserId } from '../users/users.decorators';

import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeDto } from './dto/income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomesService } from './incomes.service';

@Controller('api/incomes')
@ApiTags('Incomes')
@LoggedIn()
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get()
  @ApiPaginatedDto(IncomeDto)
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
  ) {
    return this.incomesService.findAllByUser(
      userId,
      page,
      limit,
      year,
      month,
      accountTypes,
    );
  }

  @Get('monthly-summaries')
  @ApiPaginatedDto(TransactionMonthSummaryDto)
  async findMonthlySummariesByuser(
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
    return this.incomesService.findMonthlySummariesByUser(
      userId,
      limit,
      year,
      month,
      accountTypes,
      transactionCategories?.map((id) => parseObjectId(id)),
      parentTransactionCategory,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: IncomeDto,
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
    return this.incomesService.findOne(userId, id);
  }

  @Post()
  @ApiBody({ type: CreateIncomeDto })
  @ApiOkResponse({ schema: { properties: { payload: { type: 'string' } } } })
  async create(
    @UserId() userId: ObjectId,
    @Body() createIncome: CreateIncomeDto,
  ) {
    return this.incomesService.create(userId, createIncome);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateIncomeDto })
  @ApiOkResponse({ type: IncomeDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
  update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionDto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  remove(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.incomesService.remove(userId, id);
  }
}
