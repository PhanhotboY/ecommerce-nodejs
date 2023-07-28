import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CREATED } from '../core/success.response';

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    CREATED(res, 'Register Success!', await AuthService.signUp(req.body));
  }
}
