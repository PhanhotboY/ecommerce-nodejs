import { Request, Response, NextFunction } from 'express';

import { UploadService } from '../services/upload.service';
import { OK } from '../core/success.response';

export class UploadController {
  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Image uploaded successfully',
      metadata: await UploadService.uploadImage(req.user.userId, req.file),
      link: {
        self: { href: req.originalUrl, method: req.method },
      },
    });
  }

  static async uploadMultipleImages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return OK({
      res,
      message: 'Images uploaded successfully',
      metadata: await UploadService.uploadMultipleImages(
        req.user.userId,
        req.files as Express.Multer.File[]
      ),
      link: {
        self: { href: req.originalUrl, method: req.method },
      },
    });
  }
}
