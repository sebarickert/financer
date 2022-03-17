import {
  Controller,
  Get,
  Next,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { Auth0Guard } from './guards/auth0.guard';
import { GithubGuard } from './guards/github.guard';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @Get('status')
  getAuthenticationStatus(@Req() req: Request) {
    return {
      authenticated: req.isAuthenticated(),
    };
  }

  @Get('github')
  @UseGuards(GithubGuard)
  loginGithub() {}

  @Get('auth0')
  @UseGuards(Auth0Guard)
  loginAuth0() {}

  @Get('github/redirect')
  loginGithubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const publicUrl = this.configService.get('publicUrl');

    passport.authenticate('github', {
      successRedirect: `${publicUrl}`,
      failureRedirect: '/auth/login/failed',
    })(req, res, next);
  }

  @Get('auth0/redirect')
  loginAuth0Callback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const publicUrl = this.configService.get('publicUrl');

    passport.authenticate('auth0', {
      successRedirect: `${publicUrl}`,
      failureRedirect: '/auth/login/failed',
    })(req, res, next);
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    const publicUrl = this.configService.get('publicUrl');

    req.logout();
    res.redirect(publicUrl);
  }

  @Get('logout/auth0')
  logoutAuth0(@Res() res: Response) {
    const auth0Keys = this.configService.get('auth0Keys');
    const publicUrl = this.configService.get('publicUrl');

    if (!auth0Keys)
      throw new ServiceUnavailableException('No auth0 integration enabled');

    res.redirect(
      `https://${auth0Keys.domain}/v2/logout?client_id=${auth0Keys.clientID}&returnTo=${publicUrl}/auth/logout`,
    );
  }
}
