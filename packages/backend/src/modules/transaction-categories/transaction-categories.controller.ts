import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';
import { TransactionCategoriesService } from './transaction-categories.service';

@Controller('api/transaction-categories')
@LoggedIn()
export class TransactionCategoriesController {
  constructor(
    private readonly transactionCategoriesService: TransactionCategoriesService,
  ) {}

  @Post()
  async create(
    @UserId() userId: ObjectId,
    @Body() createTransactionCategoryDto: CreateTransactionCategoryDto,
  ) {
    return this.transactionCategoriesService.create(
      userId,
      createTransactionCategoryDto,
    );
  }

  @Get()
  findAllByUser(@UserId() userId: ObjectId) {
    return this.transactionCategoriesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionCategoriesService.findOne(userId, id);
  }

  @Get(':id/summary')
  getCategorySummary(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionCategoriesService.findMonthlySummariesByUserAndId(
      userId,
      id,
    );
  }

  @Patch(':id')
  update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    return this.transactionCategoriesService.update(
      userId,
      id,
      updateTransactionCategoryDto,
    );
  }

  @Delete(':id')
  remove(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionCategoriesService.remove(userId, id);
  }
}
