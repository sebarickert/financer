import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomesService } from './incomes.service';

@Controller('api/incomes')
@LoggedIn()
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get()
  async findAllByUser(
    @UserId() userId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.incomesService.findAllByUser(userId, page, limit, year, month);
  }

  @Get('monthly-summaries')
  async findMonthlySummariesByuser(@UserId() userId: ObjectId) {
    return this.incomesService.findMonthlySummariesByUser(userId);
  }

  @Get(':id')
  async findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.incomesService.findOne(userId, id);
  }

  @Post()
  async create(
    @UserId() userId: ObjectId,
    @Body() createIncome: CreateIncomeDto,
  ) {
    return this.incomesService.create(userId, createIncome);
  }

  @Patch(':id')
  update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionDto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.incomesService.remove(userId, id);
  }
}
