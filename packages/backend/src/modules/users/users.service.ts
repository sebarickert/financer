import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

import { isApplicationInTestMode } from '@/config/configuration';
import { DUMMY_TEST_USER } from '@/config/mockAuthenticationMiddleware';
import { UserRepo } from '@/database/repos/user.repo';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepo) {}

  async findAll(): Promise<UserDto[]> {
    if (isApplicationInTestMode()) {
      return [DUMMY_TEST_USER as UserDto];
    }

    const users = await this.userRepo.findMany({});

    return UserDto.createFromPlain(users);
  }

  async findOne(id: string): Promise<UserDto | null> {
    if (isApplicationInTestMode()) {
      return DUMMY_TEST_USER as UserDto;
    }

    const user = await this.userRepo.findOne({ id });

    if (!user) {
      return null;
    }

    return UserDto.createFromPlain(user);
  }

  async findOneByGithubId(githubId: string): Promise<User | null> {
    return this.userRepo.findOne({ githubId });
  }

  async findOneByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.userRepo.findOne({ auth0Id });
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepo.create(createUserDto);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
