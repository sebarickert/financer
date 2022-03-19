import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

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
  create(@Body() createTransactionCategoryDto: CreateTransactionCategoryDto) {
    return this.transactionCategoriesService.create(
      createTransactionCategoryDto,
    );
  }

  @Get()
  findAllByUser(@UserId() userId: string) {
    return this.transactionCategoriesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    return this.transactionCategoriesService.update(
      +id,
      updateTransactionCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionCategoriesService.remove(+id);
  }
}
