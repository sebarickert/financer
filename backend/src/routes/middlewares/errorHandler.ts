/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from "express";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // eslint-disable-next-line no-console
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ error: err });
};
