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
import { AccountType, Prisma } from '@prisma/client';

import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeDetailsDto } from './dto/income-details.dto';
import { IncomeListItemDto } from './dto/income-list-item.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomesService } from './incomes.service';

import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserIdDecorator } from '@/users/users.decorators';
import { ValidateArrayPipe } from '@/utils/validate-array.pipe';
import { ValidateEntityId } from '@/utils/validate-entity-id.pipe';
import { ValidateEnumPipe } from '@/utils/validate-enum.pipe';

@Controller('api/incomes')
@ApiTags('Incomes')
@LoggedIn()
@ApiExtraModels(IncomeDetailsDto, IncomeListItemDto)
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  // eslint-disable-next-line max-lines-per-function, max-params
  @Get()
  @ApiOkResponse({ type: IncomeListItemDto, isArray: true })
  @ApiQuery({
    name: 'month',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'accountTypes',
    required: false,
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
  })
  async findAllByUser(
    @UserIdDecorator() userId: UserId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortOrder') sortOrder: Prisma.SortOrder,
    @Query(
      'accountTypes',
      new ValidateArrayPipe('|', true),
      new ValidateEnumPipe(AccountType),
    )
    accountTypes?: AccountType[],
    @Query('accountId', ValidateEntityId) accountId?: string,
  ) {
    return this.incomesService.findAllByUser(
      userId,
      page,
      limit,
      year,
      month,
      accountTypes,
      accountId,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: IncomeDetailsDto,
    description: 'Return transaction by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findOne(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.incomesService.findOne(userId, id);
  }

  @Post()
  @ApiBody({ type: CreateIncomeDto })
  @ApiOkResponse({ type: IncomeDetailsDto })
  async create(
    @UserIdDecorator() userId: UserId,
    @Body() createIncome: CreateIncomeDto,
  ) {
    return this.incomesService.create(userId, createIncome);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateIncomeDto })
  @ApiOkResponse({ type: IncomeDetailsDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
  update(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionDto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(userId, id, updateTransactionDto);
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
    return this.incomesService.remove(userId, id);
  }
}
