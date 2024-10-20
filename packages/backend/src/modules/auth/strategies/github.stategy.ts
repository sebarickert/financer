import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';

import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const githubKeys = configService.get('githubKeys');
    const publicUrl = configService.get('publicUrl');
    super({
      ...githubKeys,
      callbackURL: `${publicUrl}/auth/github/redirect`,
    });

    this.logger.log('github oauth enabled');
  }

  async validate(_accessToken: never, _refreshToken: never, profile: Profile) {
    if (!profile.id) {
      throw new ServiceUnavailableException();
    }

    try {
      const user = await this.authService.validateUserByGithub(profile.id);
      if (user) {
        return user;
      }

      return await this.userService.create({
        name: profile.displayName,
        nickname: profile.username,
        githubId: profile.id,
        profileImageUrl: profile.photos?.slice().shift()?.value,
        auth0Id: null,
        roles: [],
      });
    } catch (error) {
      this.logger.error('Error validating user by github', error);
      throw new InternalServerErrorException();
    }
  }
}
