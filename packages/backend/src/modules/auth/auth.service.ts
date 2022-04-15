import { Injectable } from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private accountsService: AccountsService,
  ) {}

  async getAuthenticationStatus(user: UserDocument) {
    const accounts = await this.accountsService.findAllByUser(user._id);
    return {
      authenticated: Boolean(user),
      payload: user,
      hasAccounts: Boolean(accounts.length),
    };
  }

  async validateUserByGithub(githubId: string): Promise<UserDocument> {
    return this.usersService.findOneByGithubId(githubId);
  }

  async validateUserByAuth0(auht0Id: string): Promise<UserDocument> {
    return this.usersService.findOneByAuth0Id(auht0Id);
  }
}
