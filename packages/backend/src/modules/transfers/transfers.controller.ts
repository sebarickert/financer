import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
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
import { AccountType } from '@prisma/client';

import { UserId } from '../../types/user-id';
import { ApiPaginatedDto } from '../../utils/pagination.decorator';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserIdDecorator } from '../users/users.decorators';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferDetailsDto } from './dto/transfer-details.dto';
import { TransferListItemDto } from './dto/transfer-list-item.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

@Controller('api/transfers')
@ApiTags('Transfers')
@ApiExtraModels(TransferDetailsDto, TransferListItemDto)
@LoggedIn()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiPaginatedDto(TransferListItemDto)
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
  async findAllByUser(
    @UserIdDecorator() userId: UserId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query(
      'accountTypes',
      new ParseArrayPipe({ separator: '|', optional: true }),
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
