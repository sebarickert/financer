import { Injectable } from '@nestjs/common';
import { UserPreferenceProperty, UserPreferences } from '@prisma/client';

import { UserPreferencesRepo } from '../../database/repos/user-preferences.repo';
import { UserId } from '../../types/user-id';

import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { UserPreferenceDto } from './dto/user-preference.dto';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly userPreferencesRepo: UserPreferencesRepo) {}

  async create(
    userId: UserId,
    createUserPreferenceDto: CreateUserPreferenceDto,
  ): Promise<UserPreferences> {
    return this.userPreferencesRepo.create({
      ...createUserPreferenceDto,
      userId,
    });
  }

  createMany(
    userId: UserId,
    createUserPreferenceDto: CreateUserPreferenceDto[],
  ) {
    return this.userPreferencesRepo.createMany(
      // @ts-expect-error - remove legacy `v` from import data
      createUserPreferenceDto.map(({ v, ...preference }) => ({
        ...preference,
        userId,
      })),
    );
  }

  async findAll(userId: UserId): Promise<UserPreferences[]> {
    return this.userPreferencesRepo.findMany({ where: { userId } });
  }

  async findAllByUserForExport(userId: UserId): Promise<UserPreferences[]> {
    const preferences = await this.userPreferencesRepo.findMany({
      where: { userId },
    });
    return UserPreferenceDto.createFromPlain(preferences);
  }

  async findOneByUserAndProperty(
    userPreferenceProperty: UserPreferenceProperty,
    userId: UserId,
  ): Promise<UserPreferences> {
    return this.userPreferencesRepo.findOne({
      userId_key: { userId, key: userPreferenceProperty },
    });
  }

  async update(
    userId: UserId,
    updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<UserPreferences> {
    const userPreferenceInDb = await this.findOneByUserAndProperty(
      updateUserPreferenceDto.key,
      userId,
    );

    if (!userPreferenceInDb) {
      return this.create(userId, updateUserPreferenceDto);
    }

    return this.userPreferencesRepo.update({
      where: {
        userId_key: { userId, key: userPreferenceInDb.key },
      },
      data: { value: updateUserPreferenceDto.value },
    });
  }

  removeAllByUser(userId: UserId) {
    return this.userPreferencesRepo.deleteMany({ userId });
  }
}
