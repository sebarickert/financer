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
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateTransactionTemplateDto } from './dto/create-transaction-template.dto';
import { UpdateTransactionTemplateDto } from './dto/update-transaction-template.dto';
import { TransactionTemplateService } from './transaction-template.service';

@Controller('api/transaction-template')
@LoggedIn()
export class TransactionTemplateController {
  constructor(
    private readonly transactionTemplateService: TransactionTemplateService,
  ) {}

  @Post()
  create(
    @UserId() userId: ObjectId,
    @Body() createTransactionTemplateDto: CreateTransactionTemplateDto,
  ) {
    return this.transactionTemplateService.create(
      createTransactionTemplateDto,
      userId,
    );
  }

  @Get()
  findAll(@UserId() userId: ObjectId) {
    return this.transactionTemplateService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionTemplateService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionTemplateDto: UpdateTransactionTemplateDto,
  ) {
    return this.transactionTemplateService.update(
      id,
      updateTransactionTemplateDto,
      userId,
    );
  }

  @Delete(':id')
  remove(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionTemplateService.remove(id, userId);
  }
}
