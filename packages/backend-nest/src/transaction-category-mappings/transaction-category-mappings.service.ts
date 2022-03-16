import { Injectable } from '@nestjs/common';

import { CreateTransactionCategoryMappingDto } from './dto/create-transaction-category-mapping.dto';
import { UpdateTransactionCategoryMappingDto } from './dto/update-transaction-category-mapping.dto';

@Injectable()
export class TransactionCategoryMappingsService {
  create(
    createTransactionCategoryMappingDto: CreateTransactionCategoryMappingDto,
  ) {
    return 'This action adds a new transactionCategoryMapping';
  }

  findAll() {
    return `This action returns all transactionCategoryMappings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionCategoryMapping`;
  }

  update(
    id: number,
    updateTransactionCategoryMappingDto: UpdateTransactionCategoryMappingDto,
  ) {
    return `This action updates a #${id} transactionCategoryMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionCategoryMapping`;
  }
}
