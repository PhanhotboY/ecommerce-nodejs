import { BadRequestError, NotFoundError } from '../core/errors';
import { ICommentAttrs } from '../interfaces/comment.interface';
import { CommentModel } from '../models/comment.model';
import {
  createComment,
  getCommentById,
  getComments,
} from '../models/repositories/comment.repo';
import { getProductDetails } from '../models/repositories/product.repo';
import { getReturnData } from '../utils';
import { findShopById } from './shop.service';

export class CommentService {
  static async createComment(comment: ICommentAttrs) {
    const { productId, parentId } = comment;

    if (!productId) {
      throw new BadRequestError('Product ID is required');
    }

    const product = await getProductDetails(productId);
    if (!product) {
      throw new BadRequestError('Product not found');
    }

    let rightValue = 1;
    if (parentId) {
      const parentComment = await getCommentById(parentId);
      if (!parentComment) {
        throw new BadRequestError('Cannot reply to a non-existent comment');
      }

      if (parentComment.comment_productId.toString() !== productId) {
        throw new BadRequestError(
          'Cannot reply to a comment from another product'
        );
      }

      rightValue = parentComment.comment_right;

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: rightValue },
        },
        { $inc: { comment_right: 2 } }
      ).exec();

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: rightValue },
        },
        { $inc: { comment_left: 2 } }
      ).exec();
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_productId: productId,
        },
        'comment_right'
      )
        .sort({ comment_right: -1 })
        .exec();

      rightValue = maxRightValue ? +maxRightValue.comment_right! + 1 : 1;
    }
    const cmt = await createComment({
      ...comment,
      left: rightValue,
      right: rightValue + 1,
    });

    return getReturnData(cmt);
  }

  static async getCommentThread(commentId: string) {
    const cmt = await getComments(commentId);
    console.log(cmt);
    return getReturnData(cmt);
  }

  static async deleteComment(
    userId: string,
    commentId: string,
    productId: string
  ) {
    const product = await getProductDetails(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    console.log(product);

    const cmt = await getCommentById(commentId);
    if (!cmt) {
      throw new NotFoundError('Comment not found');
    }
    if (cmt.comment_productId.toString() !== productId) {
      throw new BadRequestError('Comment does not belong to this product');
    }
    if (cmt.comment_userId.toString() !== userId) {
      throw new BadRequestError('You are not allowed to delete this comment');
    }

    const edge = cmt.comment_right - cmt.comment_left + 1;

    await CommentModel.deleteMany({
      comment_productId: cmt.comment_productId,
      comment_left: { $gte: cmt.comment_left },
      comment_right: { $lte: cmt.comment_right },
    }).exec();

    await CommentModel.updateMany(
      {
        comment_productId: cmt.comment_productId,
        comment_left: { $gt: cmt.comment_right },
      },
      {
        $inc: { comment_left: -edge },
      }
    ).exec();

    await CommentModel.updateMany(
      {
        comment_productId: cmt.comment_productId,
        comment_right: { $gt: cmt.comment_right },
      },
      {
        $inc: { comment_right: -edge },
      }
    ).exec();

    return true;
  }
}
