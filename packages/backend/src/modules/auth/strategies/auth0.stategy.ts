import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-auth0';

import { AuthService } from '../auth.service';

import { UsersService } from '@/users/users.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  private readonly logger = new Logger(Auth0Strategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    configService: ConfigService,
  ) {
    const auth0Keys = configService.get('auth0Keys');
    const publicUrl = configService.get('publicUrl');

    if (!auth0Keys) {
      throw new Error('Auth0 keys are not set');
    }

    super({
      ...auth0Keys,
      callbackURL: `${publicUrl}/auth/auth0/redirect`,
    });

    this.logger.log('auth0 oauth enabled');
  }

  // eslint-disable-next-line max-params
  async validate(
    _accessToken: never,
    _refreshToken: never,
    _extraParams: never,
    profile: Profile,
  ) {
    if (!profile.id) {
      throw new ServiceUnavailableException();
    }

    try {
      const user = await this.authService.validateUserByAuth0(profile.id);

      if (user) {
        return user;
      }

      return await this.userService.create({
        name: profile.displayName,
        nickname: profile.username ?? profile.displayName,
        profileImageUrl: profile.photos?.slice().shift()?.value ?? null,
        githubId: null,
        auth0Id: profile.id,
        roles: [],
        theme: 'AUTO',
      });
    } catch (error) {
      this.logger.error('Error validating user by auth0', error);
      throw new InternalServerErrorException();
    }
  }
}
