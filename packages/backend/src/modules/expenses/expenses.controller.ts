import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccountType, Prisma } from '@prisma/client';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDetailsDto } from './dto/expense-details.dto';
import { ExpenseListItemDto } from './dto/expense-list-item.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserIdDecorator } from '@/users/users.decorators';
import { ValidateArrayPipe } from '@/utils/validate-array.pipe';
import { ValidateEntityId } from '@/utils/validate-entity-id.pipe';
import { ValidateEnumPipe } from '@/utils/validate-enum.pipe';

@Controller('api/expenses')
@ApiTags('Expenses')
@LoggedIn()
@ApiExtraModels(ExpenseDetailsDto, ExpenseListItemDto)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @ApiOkResponse({ type: ExpenseListItemDto, isArray: true })
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
  })
  async findAllByUser(
    @UserIdDecorator() userId: UserId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('limit') limit: number,
    @Query('sortOrder') sortOrder: Prisma.SortOrder,
    @Query(
      'accountTypes',
      new ValidateArrayPipe('|', true),
      new ValidateEnumPipe(AccountType),
    )
    accountTypes?: AccountType[],
    @Query('accountId', ValidateEntityId) accountId?: string,
  ) {
    return this.expensesService.findAllByUser(
      userId,
      limit,
      year,
      month,
      accountTypes,
      accountId,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: ExpenseDetailsDto,
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
    return this.expensesService.findOne(userId, id);
  }

  @Post()
  @ApiBody({ type: CreateExpenseDto })
  @ApiOkResponse({ type: ExpenseDetailsDto })
  async create(
    @UserIdDecorator() userId: UserId,
    @Body() createExpense: CreateExpenseDto,
  ) {
    return this.expensesService.create(userId, createExpense);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateExpenseDto })
  @ApiOkResponse({ type: ExpenseDetailsDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
  update(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
  })
  remove(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.expensesService.remove(userId, id);
  }
}
