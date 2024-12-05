import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
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
import { ValidateArrayPipe } from '../../utils/validate-array.pipe';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { ValidateEnumPipe } from '../../utils/validate-enum.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserIdDecorator } from '../users/users.decorators';

import { AccountsService } from './accounts.service';
import { AccountBalanceHistoryDto } from './dto/account-balance-history.dto';
import { AccountDto } from './dto/account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('api/accounts')
@ApiTags('Accounts')
@ApiExtraModels(AccountDto)
@LoggedIn()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiBody({ type: CreateAccountDto })
  @ApiOkResponse({ schema: { properties: { payload: { type: 'string' } } } })
  async create(
    @UserIdDecorator() userId: UserId,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(userId, createAccountDto);
  }

  @Get()
  @ApiOkResponse({ type: AccountDto, isArray: true })
  @ApiQuery({
    name: 'accountTypes',
    required: false,
  })
  async findAllByUser(
    @UserIdDecorator() userId: UserId,
    @Query(
      'accountTypes',
      new ValidateArrayPipe('|', true),
      new ValidateEnumPipe(AccountType),
    )
    accountTypes?: AccountType[],
  ) {
    return this.accountsService.findAllByUser(userId, accountTypes);
  }

  @Get(':id')
  @ApiOkResponse({
    type: AccountDto,
    description: 'Return account by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async findOneById(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.accountsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateAccountDto })
  @ApiOkResponse({ type: AccountDto })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async update(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(userId, id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
  })
  remove(@UserIdDecorator() userId: UserId, @Param('id') id: string) {
    return this.accountsService.remove(id, userId);
  }

  @Get(':id/balance-history')
  @ApiOkResponse({
    type: AccountBalanceHistoryDto,
    isArray: true,
    description: 'Return account balance history by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async getAccountBalanceHistory(
    @UserIdDecorator() userId: UserId,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.accountsService.getAccountBalanceHistory(userId, id);
  }
}
