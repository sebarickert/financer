import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Res,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { Auth } from '../auth/decorators/auht.decorator';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import {
  UserDataService,
  ImportUserDataDto,
} from '../user-data/user-data.service';

import { UpdateUserDto, UpdateUserOwnUserDto } from './dto/update-user.dto';
import { Role } from './schemas/user.schema';
import { UserId } from './users.decorators';
import { UsersService } from './users.service';

@Controller('api/users')
@LoggedIn()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => UserDataService))
    private readonly userDataService: UserDataService,
  ) {}

  @Get('my-user')
  findOwnUser(@UserId() userId: ObjectId) {
    return this.usersService.findOne(userId);
  }

  @Get('my-user/my-data')
  getAllOwnUserData(@UserId() userId: ObjectId, @Res() res: Response) {
    this.getAllOneUserData(userId, res);
  }

  @Post('my-user/my-data')
  @Auth('test-user')
  overrideAllOwnUserData(
    @UserId() userId: ObjectId,
    @Body() userData: ImportUserDataDto,
  ) {
    return this.userDataService.overrideUserData(userId, userData);
  }

  @Patch('my-user')
  updateOwnUser(
    @UserId() userId: ObjectId,
    @Body() updateUserDto: UpdateUserOwnUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get()
  @Auth(Role.admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth(Role.admin)
  findOne(@Param('id', ValidateEntityId) id: ObjectId) {
    return this.usersService.findOne(id);
  }

  @Get(':id/my-data')
  @Auth(Role.admin)
  async getAllOneUserData(
    @Param('id', ValidateEntityId) userId: ObjectId,
    @Res() res: Response,
  ) {
    const { filename, data } = await this.userDataService.findAllOneUserData(
      userId,
    );

    res.setHeader('Content-disposition', `attachment; filename= ${filename}`);
    res.setHeader('Content-type', 'application/json');

    res.write(JSON.stringify(data), () => {
      res.end();
    });
  }

  @Patch(':id')
  @Auth('admin')
  update(
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
