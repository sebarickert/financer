import { Role, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const DUMMY_TEST_USER: Omit<User, 'createdAt' | 'updatedAt'> = {
  roles: [Role.TEST_USER],
  id: '61460d7354ea082ad0256749',
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
