import { UserPreferenceProperty } from '@local/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ObjectId } from '../../types/objectId';

import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import {
  UserPreference,
  UserPreferenceDocument,
} from './schemas/user-preference.schema';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectModel(UserPreference.name)
    private userPreferenceModel: Model<UserPreferenceDocument>,
  ) {}

  async create(
    createUserPreferenceDto: CreateUserPreferenceDto,
  ): Promise<UserPreferenceDocument> {
    return this.userPreferenceModel.create(createUserPreferenceDto);
  }

  async createMany(
    createUserPreferenceDto: CreateUserPreferenceDto[],
  ): Promise<UserPreferenceDocument[]> {
    return this.userPreferenceModel.insertMany(createUserPreferenceDto);
  }

  async findAll(userId: ObjectId): Promise<UserPreferenceDocument[]> {
    return this.userPreferenceModel.find({ userId });
  }

  async findOneByUserAndProperty(
    userPreferenceProperty: UserPreferenceProperty,
    userId: ObjectId,
  ): Promise<UserPreferenceDocument> {
    return this.userPreferenceModel.findOne({
      userId,
      key: userPreferenceProperty,
    });
  }

  async update(
    userId: ObjectId,
    updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<UserPreferenceDocument> {
    const userPreferenceInDb = await this.findOneByUserAndProperty(
      updateUserPreferenceDto.key,
      userId,
    );
    if (!userPreferenceInDb) {
      const createUserPreference = {
        ...updateUserPreferenceDto,
        userId,
      };
      return this.create(createUserPreference);
    }

    userPreferenceInDb.value = updateUserPreferenceDto.value;
    return userPreferenceInDb.save();
  }

  async removeAllByUser(userId: ObjectId): Promise<void> {
    await this.userPreferenceModel.deleteMany({ userId });
  }
}
