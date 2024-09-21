import { Request, Response, NextFunction } from 'express';
import { OK } from '../core/success.response';
import { createTemplate } from '../services/template.service';

export class MailController {
  static async createTemplate(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Template created successfully',
      metadata: await createTemplate(req.body),
    });
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Email verified successfully',
      metadata: { OK: 'ok' },
    });
  }
}
