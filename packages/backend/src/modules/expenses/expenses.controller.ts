import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('api/expenses')
@LoggedIn()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async findAllByUser(
    @UserId() userId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.expensesService.findAllByUser(userId, page, limit, year, month);
  }

  @Get('monthly-summaries')
  async findMonthlySummariesByuser(@UserId() userId: ObjectId) {
    return this.expensesService.findMonthlySummariesByUser(userId);
  }

  @Get(':id')
  async findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.expensesService.findOne(userId, id);
  }

  @Post()
  async create(
    @UserId() userId: ObjectId,
    @Body() createExpense: CreateExpenseDto,
  ) {
    return this.expensesService.create(userId, createExpense);
  }

  @Patch(':id')
  update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.expensesService.remove(userId, id);
  }
}
