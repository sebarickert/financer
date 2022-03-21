import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ValidateEntityId } from 'src/utils/validate-entity-id.pipe';

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
  async findAllByUser(@UserId() userId: string) {
    return this.incomesService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.incomesService.findOne(userId, id);
  }

  @Post()
  async create(
    @UserId() userId: string,
    @Body() createIncome: CreateIncomeDto,
  ) {
    return this.incomesService.create(userId, createIncome);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionDto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id', ValidateEntityId) id: string) {
    return this.incomesService.remove(userId, id);
  }
}
