import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import {
  isAuth0AuthEnabled,
  isGithubAuthEnabled,
} from '../../config/configuration';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSerializer } from './serialization.provider';
import { Auth0Strategy } from './strategies/auth0.stategy';
import { GithubStrategy } from './strategies/github.stategy';

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    const providers = [AuthService, AuthSerializer] as Provider[];

    if (isAuth0AuthEnabled()) {
      providers.push(Auth0Strategy);
    }
    if (isGithubAuthEnabled()) {
      providers.push(GithubStrategy);
    }

    return {
      module: AuthModule,
      imports: [
        UsersModule,
        AccountsModule,
        PassportModule.register({ defaultStrategy: 'github', session: true }),
      ],
      controllers: [AuthController],
      providers,
    };
  }
}
