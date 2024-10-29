import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { UserRepo } from '../../database/repos/user.repo';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, createMockServiceProvider(UserRepo)],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user by id', async () => {
    const user = await service.findOne(DUMMY_TEST_USER.id);

    expect(user).toMatchSnapshot();
  });

  it('should return an array of users from findAll', async () => {
    const users = await service.findAll();

    expect(users).toMatchSnapshot();
  });
});
