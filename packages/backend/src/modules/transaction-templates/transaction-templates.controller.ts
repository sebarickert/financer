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
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransactionTemplateType } from '@prisma/client';

import { CreateTransactionTemplateDto } from './dto/create-transaction-template.dto';
import { TransactionTemplateDto } from './dto/transaction-template.dto';
import { UpdateTransactionTemplateDto } from './dto/update-transaction-template.dto';
import { TransactionTemplatesService } from './transaction-templates.service';

import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserIdDecorator } from '@/users/users.decorators';
import { ValidateEntityId } from '@/utils/validate-entity-id.pipe';

@Controller('api/transaction-templates')
@ApiTags('Transaction templates')
@LoggedIn()
export class TransactionTemplatesController {
  constructor(
    private readonly transactionTemplatesService: TransactionTemplatesService,
  ) {}

  @Post()
  @ApiBody({ type: CreateTransactionTemplateDto })
  @ApiOkResponse({ schema: { properties: { payload: { type: 'string' } } } })
  create(
    @UserIdDecorator() userId: UserId,
    @Body() createTransactionTemplateDto: CreateTransactionTemplateDto,
  ) {
    return this.transactionTemplatesService.create(
      createTransactionTemplateDto,
      userId,
    );
  }

  @Get()
  @ApiOkResponse({
    type: [TransactionTemplateDto],
    description: 'Return all transaction templates',
  })
  findAllByUser(@UserIdDecorator() userId: UserId) {
    return this.transactionTemplatesService.findAllByUser(userId);
  }

  @Get('/manual')
  @ApiOkResponse({
    type: [TransactionTemplateDto],
    description: 'Return all transaction templates of type manual',
  })
  findAllManualTypeByUser(@UserIdDecorator() userId: UserId) {
    return this.transactionTemplatesService.findAllByUserAndType(
      userId,
      TransactionTemplateType.MANUAL,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: TransactionTemplateDto,
    description: 'Return transaction template by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  findOne(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.transactionTemplatesService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateTransactionTemplateDto })
  @ApiOkResponse({ type: TransactionTemplateDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
  update(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateTransactionTemplateDto: UpdateTransactionTemplateDto,
  ) {
    return this.transactionTemplatesService.update(
      id,
      updateTransactionTemplateDto,
      userId,
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
    return this.transactionTemplatesService.remove(id, userId);
  }
}
