import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/schemas/user.schema';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUserByGithub(githubId: string): Promise<User> {
    return this.usersService.findOneByGithubId(githubId);
  }

  async validateUserByAuth0(auht0Id: string): Promise<User> {
    return this.usersService.findOneByAuth0Id(auht0Id);
  }
}
