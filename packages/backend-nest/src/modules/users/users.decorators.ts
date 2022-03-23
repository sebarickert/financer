import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserDocument } from './schemas/user.schema';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserDocument;

    return user._id;
  },
);
