import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { isNodeEnvInTest } from '../../config/configuration';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { ObjectId } from '../../types/objectId';

import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: ObjectId): Promise<UserDocument> {
    return !isNodeEnvInTest()
      ? this.userModel.findById(id).exec()
      : (DUMMY_TEST_USER as UserDocument);
  }

  async findOneByGithubId(githubId: string): Promise<UserDocument> {
    return this.userModel.findOne({ githubId }).exec();
  }

  async findOneByAuth0Id(auth0Id: string): Promise<UserDocument> {
    return this.userModel.findOne({ auth0Id }).exec();
  }

  async create(createUserDto: User) {
    return this.userModel.create(createUserDto);
  }

  update(id: ObjectId, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  remove(id: ObjectId) {
    return `This action removes a #${id} user`;
  }
}
