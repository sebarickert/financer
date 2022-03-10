import { NextFunction, Request, Response } from 'express';

export const DUMMY_TEST_USER = {
  roles: ['test-user'],
  _id: '61460d7354ea082ad0256749',
  id: '61460d7354ea082ad0256749',
  name: 'Dummy Test User',
};

export const mockAuthenticationMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  req.user = DUMMY_TEST_USER;
  req.isAuthenticated = () => true;
  next();
};
