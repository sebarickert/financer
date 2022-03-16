import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateTransactionCategoryMappingDto } from './dto/create-transaction-category-mapping.dto';
import { UpdateTransactionCategoryMappingDto } from './dto/update-transaction-category-mapping.dto';
import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

@Controller('transaction-category-mappings')
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
  findAll() {
    return this.transactionCategoryMappingsService.findAll();
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
