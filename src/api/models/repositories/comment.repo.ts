import { CommentModel } from '../comment.model';
import { IComment, ICommentAttrs } from '../../interfaces/comment.interface';
import { COMMENT } from '../../constants/comment.constant';
import { Types } from 'mongoose';

const createComment = (comment: ICommentAttrs) => {
  return CommentModel.build(comment);
};

const getComments = async (parentId: string) => {
  const thread = await CommentModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(parentId) },
    },
    {
      $lookup: {
        from: COMMENT.COLLECTION_NAME,
        let: {
          left: '$comment_left',
          right: '$comment_right',
          productId: '$comment_productId',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $gt: ['$comment_left', '$$left'] },
                  { $lt: ['$comment_right', '$$right'] },
                  { $eq: ['$comment_productId', '$$productId'] },
                ],
              },
            },
          },
          {
            $sort: { comment_left: 1 },
          },
          {
            $limit: 5,
          },
        ],
        as: 'repliedComments',
      },
    },
  ]);

  return thread[0] ? thread[0] : {};
};

const getCommentById = (id: string) => {
  return CommentModel.findById(id);
};

const deleteComment = (id: string) => {
  return CommentModel.findByIdAndDelete(id);
};

export { createComment, getComments, getCommentById };
