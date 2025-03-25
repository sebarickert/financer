import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class Auth0Guard extends AuthGuard('auth0') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());
    return result;
  }

  getAuthenticateOptions(): IAuthModuleOptions {
    return { scope: ['openid', 'profile', 'email'], prompt: 'login' };
  }
}
