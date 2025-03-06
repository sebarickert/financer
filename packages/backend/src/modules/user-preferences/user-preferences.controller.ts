import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserPreferenceProperty } from '@prisma/client';

import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { UserPreferenceDto } from './dto/user-preference.dto';
import { UserPreferencesService } from './user-preferences.service';

import { LoggedIn } from '@/auth/decorators/logged-in.decorators';
import { UserId } from '@/types/user-id';
import { UserIdDecorator } from '@/users/users.decorators';

@Controller('api/user-preferences')
@LoggedIn()
@ApiTags('User preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [UserPreferenceDto] })
  async findAll(@UserIdDecorator() userId: UserId) {
    return this.userPreferencesService.findAll(userId);
  }

  @Get(':userPreferenceProperty')
  @ApiOkResponse({ type: UserPreferenceDto })
  @ApiParam({
    name: 'userPreferenceProperty',
    enum: UserPreferenceProperty,
    enumName: 'UserPreferenceProperty',
  })
  async findOne(
    @Param('userPreferenceProperty')
    userPreferenceProperty: UserPreferenceProperty,
    @UserIdDecorator() userId: UserId,
  ) {
    return (
      (await this.userPreferencesService.findOneByUserAndProperty(
        userPreferenceProperty,
        userId,
      )) ?? {
        key: userPreferenceProperty,
        value: '',
        userId,
      }
    );
  }

  @Patch()
  @ApiOkResponse({ type: UserPreferenceDto })
  @ApiBody({ type: UpdateUserPreferenceDto })
  async update(
    @UserIdDecorator() userId: UserId,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ) {
    return this.userPreferencesService.update(userId, updateUserPreferenceDto);
  }
}
