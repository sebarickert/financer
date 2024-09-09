import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccountType } from '@prisma/client';

import { ApiPaginatedDto } from '../../utils/pagination.decorator';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDto } from './dto/expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('api/expenses')
@ApiTags('Expenses')
@LoggedIn()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @ApiPaginatedDto(ExpenseDto)
  @ApiQuery({
    name: 'month',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    required: false,
  })
  @ApiQuery({
    name: 'page',
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
  async findAllByUser(
    @UserId() userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query(
      'accountTypes',
      new ParseArrayPipe({ separator: '|', optional: true }),
    )
    accountTypes?: AccountType[],
    @Query('accountId', ValidateEntityId) accountId?: string,
  ) {
    return this.expensesService.findAllByUser(
      userId,
      page,
      limit,
      year,
      month,
      accountTypes,
      accountId,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: ExpenseDto,
    description: 'Return transaction by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findOne(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.expensesService.findOne(userId, id);
  }

  @Post()
  @ApiBody({ type: CreateExpenseDto })
  @ApiOkResponse({ type: ExpenseDto })
  async create(
    @UserId() userId: string,
    @Body() createExpense: CreateExpenseDto,
  ) {
    return this.expensesService.create(userId, createExpense);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateExpenseDto })
  @ApiOkResponse({ type: ExpenseDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
  update(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  remove(@UserId() userId: string, @Param('id', ValidateEntityId) id: string) {
    return this.expensesService.remove(userId, id);
  }
}
