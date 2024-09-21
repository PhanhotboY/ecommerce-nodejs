import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CREATED, OK } from '../core/success.response';
import { HEADER } from '../constants';

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    CREATED({
      res,
      message: 'Register Success!',
      metadata: await AuthService.signUp(req.body),
      link: {
        signOut: { href: '/signout', method: 'POST' },
      },
    });
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Login Success!',
      metadata: await AuthService.signIn({
        ...req.body,
        refreshToken: req.headers[HEADER.REFRESH_TOKEN],
      }),
      link: {
        signOut: { href: '/api/v1/signout', method: 'POST' },
        createProduct: { href: '/api/v1/products', method: 'POST' },
      },
    });
  }

  static async signOut(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Logout Success!',
      metadata: await AuthService.signOut(req.keyToken._id as string),
      link: {
        signUp: { href: '/api/v1/signup', method: 'POST' },
        signIn: { href: '/api/v1/signin', method: 'POST' },
      },
    });
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Refresh tokens Success!',
      metadata: await AuthService.refreshTokenHandler(req),
      link: {
        signOut: { href: '/api/v1/signout', method: 'POST' },
      },
    });
  }
}
