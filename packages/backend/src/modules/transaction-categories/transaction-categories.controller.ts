import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@silte/nestjs-swagger';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { TransactionCategoryDto } from './dto/transaction-category.dto';
import { CategoryMonthlySummaryDto } from './dto/transaction-month-summary.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';
import { TransactionCategoriesService } from './transaction-categories.service';

@Controller('api/transaction-categories')
@ApiTags('Transaction categories')
@ApiExtraModels(TransactionCategoryDto, CategoryMonthlySummaryDto)
@LoggedIn()
export class TransactionCategoriesController {
  constructor(
    private readonly transactionCategoriesService: TransactionCategoriesService,
  ) {}

  @Post()
  @ApiBody({ type: CreateTransactionCategoryDto })
  @ApiOkResponse({ schema: { properties: { payload: { type: 'string' } } } })
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
  @ApiOkResponse({
    type: [TransactionCategoryDto],
    description: 'Return transaction category by id',
  })
  findAllByUser(@UserId() userId: ObjectId) {
    return this.transactionCategoriesService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: TransactionCategoryDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionCategoriesService.findOne(userId, id);
  }

  @Get(':id/summary')
  @ApiOkResponse({
    type: [CategoryMonthlySummaryDto],
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
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
  @ApiBody({ type: UpdateTransactionCategoryDto })
  @ApiOkResponse({ type: TransactionCategoryDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
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
  @ApiParam({
    name: 'id',
    type: String,
  })
  remove(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionCategoriesService.remove(userId, id);
  }
}
