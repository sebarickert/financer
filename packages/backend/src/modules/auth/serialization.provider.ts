import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';

import { UserId } from '@/types/user-id';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, userId: UserId) => void) {
    done(null, user.id as UserId);
  }

  async deserializeUser(
    userId: UserId,
    done: (err: Error | null, user: User) => void,
  ) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    done(null, user);
  }
}
