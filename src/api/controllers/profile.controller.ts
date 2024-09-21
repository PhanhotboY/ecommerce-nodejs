import { Request, Response, NextFunction } from 'express';
import { OK } from '../core/success.response';

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Profile retrieved successfully',
      metadata: {
        email: 'phan@gmail.com',
        name: 'Phan',
        rank: 'lb',
      },
    });
  }

  static async getProfiles(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Profiles retrieved successfully',
      metadata: [
        {
          email: 'phan@gmail.com',
          name: 'Phan',
          rank: 'lb',
        },
        {
          email: 'hung@gmail.com',
          name: 'Hung',
          rank: 'ct',
        },
        {
          email: 'tuan@gmail.com',
          name: 'Tuan',
          rank: 'kc',
        },
        {
          email: 'hoai@gmail.com',
          name: 'Hoai',
          rank: 'kc',
        },
        {
          email: 'tinh@gmail.com',
          name: 'Tinh',
          rank: 'lb',
        },
      ],
    });
  }
}
