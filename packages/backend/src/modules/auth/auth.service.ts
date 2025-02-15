import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { AccountsService } from '@/accounts/accounts.service';
import { UserId } from '@/types/user-id';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) {}

  async getAuthenticationStatus(user?: User) {
    const hasAccounts = user
      ? await this.accountsService.hasAccounts(user.id as UserId)
      : false;

    return {
      authenticated: Boolean(user),
      payload: user,
      hasAccounts,
    };
  }

  async validateUserByGithub(githubId: string): Promise<User | null> {
    return this.usersService.findOneByGithubId(githubId);
  }

  async validateUserByAuth0(auth0Id: string): Promise<User | null> {
    return this.usersService.findOneByAuth0Id(auth0Id);
  }
}
