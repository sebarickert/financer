import { NextFunction, Request, Response } from 'express';

import { Role, UserDocument } from '../modules/users/schemas/user.schema';
import { parseObjectId } from '../types/objectId';

export const DUMMY_TEST_USER: Partial<UserDocument> = {
  roles: [Role.testUser],
  _id: parseObjectId('61460d7354ea082ad0256749'),
  name: 'Dummy Test User',
};

export const mockAuthenticationMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  req.user = DUMMY_TEST_USER;
  req.isAuthenticated = () => true;
  next();
};
