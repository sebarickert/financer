import { Controller, Get, Next, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { AuthService } from './auth.service';
import { GithubGuard } from './guards/github.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(GithubGuard)
  loginGithub() {}

  @Get('github/redirect')
  loginGithubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const publicUrl = this.configService.get('publicUrl');

    passport.authenticate('github', {
      successRedirect: `${publicUrl}/users/my-user`,
      failureRedirect: '/auth/login/failed',
    })(req, res, next);
  }
}
