import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-auth0';
import { UsersService } from 'src/modules/users/users.service';

import { AuthService } from '../auth.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    const auth0Keys = configService.get('auth0Keys');
    const publicUrl = configService.get('publicUrl');
    super({
      ...auth0Keys,
      scope: 'openid email profile',
      callbackURL: `${publicUrl}/auth/auth0/redirect`,
    });

    console.log('auth0 oauth enabled');
  }

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
        nickname: profile.username,
        profileImageUrl: profile.photos?.slice().shift()?.value,
        githubId: null,
        auth0Id: profile.id,
        roles: [],
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
