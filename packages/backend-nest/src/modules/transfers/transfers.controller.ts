import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ValidateEntityId } from 'src/utils/validate-entity-id.pipe';

import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

@Controller('api/transfers')
@LoggedIn()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  async findAllByUser(@UserId() userId: string) {
    return this.transfersService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.transfersService.findOne(userId, id);
  }

  @Post()
  async create(
    @UserId() userId: string,
    @Body() createTransfer: CreateTransferDto,
  ) {
    return this.transfersService.create(userId, createTransfer);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id', ValidateEntityId) id: string) {
    return this.transfersService.remove(userId, id);
  }
}
