import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { isNodeEnvInTest } from '../config/configuration';
import { DUMMY_TEST_USER } from '../config/mockAuthenticationMiddleware';

import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return !isNodeEnvInTest()
      ? this.userModel.findById(id).exec()
      : (DUMMY_TEST_USER as User);
  }

  async findOneByGithubId(githubId: string): Promise<User> {
    return this.userModel.findOne({ githubId }).exec();
  }

  async findOneByAuth0Id(auth0Id: string): Promise<User> {
    return this.userModel.findOne({ auth0Id }).exec();
  }

  async create(createUserDto: User) {
    return this.userModel.create(createUserDto);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
