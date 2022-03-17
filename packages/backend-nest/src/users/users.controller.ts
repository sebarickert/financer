import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auht.decorator';
import { LoggedIn } from 'src/auth/decorators/loggedIn.decorators';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserId } from './users.decorators';
import { UsersService } from './users.service';

@Controller('api/users')
@LoggedIn()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my-user')
  findOwnUser(@UserId() userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get('my-user/my-data')
  getAllOwnUserData(@UserId() userId: string) {
    return this.usersService.findOne(userId);
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
  getAllOneUserData(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
