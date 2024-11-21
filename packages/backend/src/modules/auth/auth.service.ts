import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserId } from '../../types/user-id';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) {}

  async getAuthenticationStatus(user?: User) {
    const accounts = user
      ? await this.accountsService.findAllByUser(user.id as UserId)
      : [];
    return {
      authenticated: Boolean(user),
      payload: user,
      hasAccounts: Boolean(accounts?.length),
    };
  }

  async validateUserByGithub(githubId: string): Promise<User> {
    return this.usersService.findOneByGithubId(githubId);
  }

  async validateUserByAuth0(auth0Id: string): Promise<User> {
    return this.usersService.findOneByAuth0Id(auth0Id);
  }
}
