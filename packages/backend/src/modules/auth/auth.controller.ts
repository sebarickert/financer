import {
  Controller,
  Get,
  Logger,
  Next,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { AuthService } from './auth.service';
import { AuthenticationStatusDto } from './dto/authentication-status.dto';
import { Auth0Guard } from './guards/auth0.guard';
import { GithubGuard } from './guards/github.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('status')
  @ApiOkResponse({
    description:
      "Returns the user's authentication status and user data if logged in",
    type: AuthenticationStatusDto,
  })
  async getAuthenticationStatus(@Req() req: Request) {
    return this.authService.getAuthenticationStatus(req.user as User);
  }

  @Get('github')
  @ApiResponse({
    description: 'If github oauth enabled redirects to github login page',
  })
  @UseGuards(GithubGuard)
  loginGithub() {
    // Guard will handle the redirection
  }

  @Get('auth0')
  @ApiResponse({
    description: 'If auth0 oauth enabled redirects to auth0 login page',
  })
  @UseGuards(Auth0Guard)
  loginAuth0() {
    // Guard will handle the redirection
  }

  @Get('github/redirect')
  @ApiResponse({
    description: 'Callback endpoint from github oauth',
  })
  loginGithubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const publicUrl = this.configService.get('publicUrl');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    passport.authenticate('github', {
      successRedirect: publicUrl,
      failureRedirect: '/auth/login/failed',
    })(req, res, next);
  }

  @Get('auth0/redirect')
  @ApiResponse({
    description: 'Callback endpoint from auth0 oauth',
  })
  loginAuth0Callback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const publicUrl = this.configService.get('publicUrl');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    passport.authenticate('auth0', {
      successRedirect: publicUrl,
      failureRedirect: '/auth/login/failed',
    })(req, res, next);
  }

  @Get('logout')
  @ApiResponse({
    status: 302,
    description: 'Logout user with current session from our system',
  })
  logout(@Req() req: Request, @Res() res: Response) {
    const publicUrl = this.configService.get('publicUrl');

    req.logout((err) => {
      if (err) {
        this.logger.error(err);
      }

      res.redirect(publicUrl);
    });
  }

  @Get('logout/auth0')
  @ApiResponse({
    status: 302,
    description:
      'Terminates user session from Auth0 and redirects to public URL',
  })
  logoutAuth0(@Res() res: Response) {
    const auth0Keys = this.configService.get('auth0Keys');
    const publicUrl = this.configService.get('publicUrl');

    if (!auth0Keys)
      throw new ServiceUnavailableException('No auth0 integration enabled');

    res.redirect(
      `https://${auth0Keys.domain}/v2/logout?client_id=${auth0Keys.clientID}&returnTo=${publicUrl}/auth/logout`,
    );
  }

  // This is a test endpoint to check if error handling works
  @Get('throw-error')
  throwError() {
    throw new Error('This is a test error');
  }
}
