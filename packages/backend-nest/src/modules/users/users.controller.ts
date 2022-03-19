import { Controller, Get, Body, Patch, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Auth } from 'src/modules/auth/decorators/auht.decorator';
import { LoggedIn } from 'src/modules/auth/decorators/loggedIn.decorators';
import { UserDataService } from 'src/modules/user-data/user-data.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserId } from './users.decorators';
import { UsersService } from './users.service';

@Controller('api/users')
@LoggedIn()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userDataService: UserDataService,
  ) {}

  @Get('my-user')
  findOwnUser(@UserId() userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get('my-user/my-data')
  getAllOwnUserData(@UserId() userId: string, @Res() res: Response) {
    this.getAllOneUserData(userId, res);
  }

  @Post('my-user/my-data')
  @Auth('test-user')
  overrideAllOwnUserData(@UserId() userId: string) {
    return this.userDataService.overrideUserData();
  }

  @Patch('my-user')
  updateOwnUser(
    @UserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get()
  @Auth('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/my-data')
  @Auth('admin')
  async getAllOneUserData(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    const { filename, data } = await this.userDataService.findAllOneUserData(
      user,
    );

    res.setHeader('Content-disposition', `attachment; filename= ${filename}`);
    res.setHeader('Content-type', 'application/json');

    res.write(data, () => {
      res.end();
    });
  }

  @Patch(':id')
  @Auth('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
