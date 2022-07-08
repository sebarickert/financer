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
  create(@Body() createTransactionTemplateDto: CreateTransactionTemplateDto) {
    return this.transactionTemplateService.create(createTransactionTemplateDto);
  }

  @Get()
  findAll() {
    return this.transactionTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateEntityId) id: ObjectId) {
    return this.transactionTemplateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionTemplateDto: UpdateTransactionTemplateDto,
  ) {
    return this.transactionTemplateService.update(
      id,
      updateTransactionTemplateDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ValidateEntityId) id: ObjectId) {
    return this.transactionTemplateService.remove(id);
  }
}
