import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { ObjectId } from '../../types/objectId';
import { UserDocument, User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: UserDocument, done: (err: Error, string) => void) {
    done(null, user._id);
  }

  async deserializeUser(
    userId: ObjectId,
    done: (err: Error, user: User) => void,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    done(null, user);
  }
}
