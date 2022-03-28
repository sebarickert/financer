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
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateTransactionCategoryMappingDto } from './dto/create-transaction-category-mapping.dto';
import { UpdateTransactionCategoryMappingDto } from './dto/update-transaction-category-mapping.dto';
import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

@Controller('api/transaction-category-mappings')
@LoggedIn()
export class TransactionCategoryMappingsController {
  constructor(
    private readonly transactionCategoryMappingsService: TransactionCategoryMappingsService,
  ) {}

  @Post()
  create(
    @Body()
    createTransactionCategoryMappingDto: CreateTransactionCategoryMappingDto,
  ) {
    return this.transactionCategoryMappingsService.create(
      createTransactionCategoryMappingDto,
    );
  }

  @Get()
  findAllByUser(@UserId() userId: ObjectId) {
    return this.transactionCategoryMappingsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionCategoryMappingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateTransactionCategoryMappingDto: UpdateTransactionCategoryMappingDto,
  ) {
    return this.transactionCategoryMappingsService.update(
      +id,
      updateTransactionCategoryMappingDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionCategoryMappingsService.remove(+id);
  }
}
