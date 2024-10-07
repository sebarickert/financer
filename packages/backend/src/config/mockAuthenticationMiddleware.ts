import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { UserDto } from '../modules/users/dto/user.dto';
import { UserId } from '../types/user-id';

export const DUMMY_TEST_USER: Omit<UserDto, 'createdAt' | 'updatedAt'> = {
  roles: [Role.TEST_USER],
  id: '61460d7354ea082ad0256749' as UserId,
  name: 'Dummy Test User',
  auth0Id: '',
  githubId: '',
  nickname: '',
  profileImageUrl: '',
};

export const mockAuthenticationMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  req.user = DUMMY_TEST_USER;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req.isAuthenticated = (() => true) as any;
  next();
};
