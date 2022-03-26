import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

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
    @UserId() userId: string,
    @Body() createTransactionCategoryDto: CreateTransactionCategoryDto,
  ) {
    return this.transactionCategoriesService.create(
      userId,
      createTransactionCategoryDto,
    );
  }

  @Get()
  findAllByUser(@UserId() userId: string) {
    return this.transactionCategoriesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: string, @Param('id', ValidateEntityId) id: string) {
    return this.transactionCategoriesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    return this.transactionCategoriesService.update(
      userId,
      id,
      updateTransactionCategoryDto,
    );
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id', ValidateEntityId) id: string) {
    return this.transactionCategoriesService.remove(userId, id);
  }
}
