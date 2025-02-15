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

import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferDetailsDto } from './dto/transfer-details.dto';
import { TransferListItemDto } from './dto/transfer-list-item.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserIdDecorator } from '@/users/users.decorators';
import { ValidateArrayPipe } from '@/utils/validate-array.pipe';
import { ValidateEntityId } from '@/utils/validate-entity-id.pipe';
import { ValidateEnumPipe } from '@/utils/validate-enum.pipe';

@Controller('api/transfers')
@ApiTags('Transfers')
@ApiExtraModels(TransferDetailsDto, TransferListItemDto)
@LoggedIn()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  // eslint-disable-next-line max-lines-per-function, max-params
  @Get()
  @ApiOkResponse({ type: TransferListItemDto, isArray: true })
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
    return this.transfersService.findAllByUser(
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
    type: TransferDetailsDto,
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
    return this.transfersService.findOne(userId, id);
  }

  @Post()
  @ApiBody({ type: CreateTransferDto })
  @ApiOkResponse({ type: TransferDetailsDto })
  async create(
    @UserIdDecorator() userId: UserId,
    @Body() createTransfer: CreateTransferDto,
  ) {
    return this.transfersService.create(userId, createTransfer);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateTransferDto })
  @ApiOkResponse({ type: TransferDetailsDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
  update(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(userId, id, updateTransactionDto);
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
    return this.transfersService.remove(userId, id);
  }
}
