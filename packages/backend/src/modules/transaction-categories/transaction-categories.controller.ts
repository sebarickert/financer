import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { TransactionCategoryDetailsDto } from './dto/transaction-category-details.dto';
import { TransactionCategoryDto } from './dto/transaction-category.dto';
import { CategoryMonthlySummaryDto } from './dto/transaction-month-summary.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';
import { TransactionCategoriesService } from './transaction-categories.service';

import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserIdDecorator } from '@/users/users.decorators';
import { ValidateEntityId } from '@/utils/validate-entity-id.pipe';

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
    @UserIdDecorator() userId: UserId,
    @Body() createTransactionCategoryDto: CreateTransactionCategoryDto,
  ) {
    return this.transactionCategoriesService.create(
      userId,
      createTransactionCategoryDto,
    );
  }

  @Get()
  @ApiOkResponse({
    type: [TransactionCategoryDetailsDto],
    description: 'Return transaction category by id',
  })
  @ApiQuery({
    name: 'visibilityType',
    required: false,
    enum: TransactionType,
    enumName: 'visibilityType',
  })
  findAllByUser(
    @UserIdDecorator() userId: UserId,
    @Query('visibilityType') visibilityType?: TransactionType,
  ) {
    return this.transactionCategoriesService.findAllDetailsByUser(
      userId,
      visibilityType,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: TransactionCategoryDetailsDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  findOne(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.transactionCategoriesService.findOne(userId, id);
  }

  // eslint-disable-next-line max-params
  @Get(':id/summary')
  @ApiOkResponse({
    type: [CategoryMonthlySummaryDto],
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiQuery({
    name: 'month',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    required: false,
  })
  getCategorySummary(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.transactionCategoriesService.findMonthlySummariesByUserAndId(
      userId,
      id,
      year,
      month,
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
    @UserIdDecorator() userId: UserId,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
  })
  remove(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.transactionCategoriesService.remove(userId, id);
  }
}
