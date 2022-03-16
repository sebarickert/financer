import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSerializer } from './serialization.provider';
import { GithubStrategy } from './strategies/github.stategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'github', session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSerializer, GithubStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), passport.initialize(), passport.session())
      .forRoutes('*');
  }
}
