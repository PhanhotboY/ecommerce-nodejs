import { AccessControl, Permission, Query } from 'accesscontrol';
import { NextFunction, Request, Response } from 'express';
import { InternalServerError } from '../core/errors';

const ac = new AccessControl();

export const grantAccess = (action: keyof Query, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ac.setGrants( await )
      const permission = ac
        .can(req.query.role as string)
        [action](resource) as Permission;
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error: any) {
      const err = new InternalServerError(error.message);
      next(err);
    }
  };
};
