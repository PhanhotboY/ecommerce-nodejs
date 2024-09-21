import { Request, Response, NextFunction } from 'express';
import { OK } from '../core/success.response';
import { CommentService } from '../services/comment.service';

export class CommentController {
  static async createComment(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Comment created successfully',
      metadata: await CommentService.createComment(req.body),
      link: {
        self: { href: req.originalUrl, method: req.method },
      },
    });
  }

  static async getCommentThread(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    OK({
      res,
      message: 'Comment thread retrieved successfully',
      metadata: await CommentService.getCommentThread(req.params.commentId),
      link: {
        self: { href: req.originalUrl, method: req.method },
      },
    });
  }

  static async deleteComment(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Comment deleted successfully',
      metadata: await CommentService.deleteComment(
        req.user.userId,
        req.params.commentId,
        req.body.productId
      ),
      link: {
        self: { href: req.originalUrl, method: req.method },
      },
    });
  }
}
