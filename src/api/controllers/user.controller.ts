import { Request, Response } from 'express';

import { newUser, verifyEmailToken } from '../services/user.service';
import { OK } from '../core/success.response';

export class UserController {
  static async newUser(req: Request, res: Response) {
    return OK({
      res,
      message: 'User created successfully',
      metadata: await newUser(req.body),
    });
  }

  static async verifyEmailToken(req: Request, res: Response) {
    return OK({
      res,
      message: 'Email verified successfully',
      metadata: await verifyEmailToken({ token: req.query.token as string }),
    });
  }
}
