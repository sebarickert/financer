import { UpdateUserPreferenceDto, UserPreferenceProperty } from '@local/types';
import { Controller, Get, Body, Patch, Param } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { UserPreferencesService } from './user-preferences.service';

@Controller('api/user-preferences')
@LoggedIn()
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get()
  findAll(@UserId() userId: ObjectId) {
    return this.userPreferencesService.findAll(userId);
  }

  @Get(':userPreferenceProperty')
  findOne(
    @Param('userPreferenceProperty')
    userPreferenceProperty: UserPreferenceProperty,
    @UserId() userId: ObjectId,
  ) {
    return this.userPreferencesService.findOneByUserAndProperty(
      userPreferenceProperty,
      userId,
    );
  }

  @Patch()
  update(
    @UserId() userId: ObjectId,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ) {
    return this.userPreferencesService.update(userId, updateUserPreferenceDto);
  }
}
