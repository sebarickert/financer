import { TransactionTemplateType } from '@local/types';
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
import { TransactionTemplatesService as TransactionTemplatesService } from './transaction-templates.service';

@Controller('api/transaction-templates')
@LoggedIn()
export class TransactionTemplatesController {
  constructor(
    private readonly transactionTemplatesService: TransactionTemplatesService,
  ) {}

  @Post()
  create(
    @UserId() userId: ObjectId,
    @Body() createTransactionTemplateDto: CreateTransactionTemplateDto,
  ) {
    return this.transactionTemplatesService.create(
      createTransactionTemplateDto,
      userId,
    );
  }

  @Get()
  findAllByUser(@UserId() userId: ObjectId) {
    return this.transactionTemplatesService.findAllByUser(userId);
  }

  @Get('/manual')
  findAllManualTypeByUser(@UserId() userId: ObjectId) {
    return this.transactionTemplatesService.findAllByUserAndType(
      userId,
      TransactionTemplateType.MANUAL,
    );
  }

  @Get(':id')
  findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionTemplatesService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionTemplateDto: UpdateTransactionTemplateDto,
  ) {
    return this.transactionTemplatesService.update(
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
    return this.transactionTemplatesService.remove(id, userId);
  }
}
