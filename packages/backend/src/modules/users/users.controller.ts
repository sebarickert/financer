import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Res,
  forwardRef,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';

import { UpdateUserOwnUserDto } from './dto/update-own-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserIdDecorator } from './users.decorators';
import { UsersService } from './users.service';

import { Auth } from '@/auth/decorators/auth.decorator';
import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserDataExportDto } from '@/user-data/dto/user-data-export.dto';
import { UserDataImportDto } from '@/user-data/dto/user-data-import.dto';
import { UserDataService } from '@/user-data/user-data.service';
import { ValidateEntityId } from '@/utils/validate-entity-id.pipe';

@Controller('api/users')
@LoggedIn()
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => UserDataService))
    private readonly userDataService: UserDataService,
  ) {}

  @Get('my-user')
  @ApiOkResponse({ type: UserDto })
  async findOwnUser(@UserIdDecorator() userId: UserId) {
    return this.usersService.findOne(userId);
  }

  @Get('my-user/my-data')
  @ApiOkResponse({ type: UserDataExportDto })
  getAllOwnUserData(@UserIdDecorator() userId: UserId, @Res() res: Response) {
    return this.getAllOneUserData(userId, res);
  }

  @Post('my-user/my-data')
  @Auth(Role.TEST_USER)
  @ApiBody({ type: UserDataImportDto })
  @ApiOkResponse({ schema: { properties: { payload: { type: 'string' } } } })
  overrideAllOwnUserData(
    @UserIdDecorator() userId: UserId,
    @Body() userData: UserDataImportDto,
  ) {
    return this.userDataService.overrideUserData(userId, userData);
  }

  @Patch('my-user')
  @ApiBody({ type: UpdateUserOwnUserDto })
  @ApiOkResponse({ type: UserDto })
  updateOwnUser(
    @UserIdDecorator() userId: UserId,
    @Body() updateUserDto: UpdateUserOwnUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  @ApiOkResponse({ type: [UserDto] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  @ApiOkResponse({ type: UserDto })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Entity id from users collection.',
  })
  findOne(@Param('id', ValidateEntityId) id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/my-data')
  @Auth(Role.ADMIN)
  @ApiOkResponse({ type: UserDataExportDto })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Entity id from users collection.',
  })
  async getAllOneUserData(
    @Param('id', ValidateEntityId) userId: UserId,
    @Res() res: Response,
  ) {
    const { filename, data } =
      await this.userDataService.findAllOneUserData(userId);

    res.setHeader('Content-disposition', `attachment; filename= ${filename}`);
    res.setHeader('Content-type', 'application/json');

    res.write(JSON.stringify(data), () => {
      res.end();
    });
  }

  @Patch(':id')
  @Auth('admin')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserDto })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Entity id from users collection.',
  })
  update(
    @Param('id', ValidateEntityId) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
