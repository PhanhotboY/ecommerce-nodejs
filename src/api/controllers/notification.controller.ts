import { Request, Response, NextFunction } from 'express';

import { NotificationService } from '../services/notification.service';
import { OK } from '../core/success.response';

export class NotificationController {
  static async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    OK({
      res,
      message: 'Get all notifications successfully!',
      metadata: await NotificationService.getNotifications(
        req.user.userId,
        req.query.type as string
      ),
      link: {
        self: { href: '/api/v1/notifications', method: 'GET' },
      },
    });
  }
}
