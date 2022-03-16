import { Injectable } from '@nestjs/common';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';

@Injectable()
export class TransactionCategoriesService {
  create(createTransactionCategoryDto: CreateTransactionCategoryDto) {
    return 'This action adds a new transactionCategory';
  }

  findAll() {
    return `This action returns all transactionCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionCategory`;
  }

  update(
    id: number,
    updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    return `This action updates a #${id} transactionCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionCategory`;
  }
}
