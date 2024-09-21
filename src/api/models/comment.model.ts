import { Schema, model } from 'mongoose';
import {
  IComment,
  ICommentAttrs,
  ICommentModel,
  IRawComment,
} from '../interfaces/comment.interface';
import { PRODUCT, SHOP } from '../constants';
import { COMMENT } from '../constants/comment.constant';
import { formatAttributeName } from '../utils';

const commentSchema = new Schema<IComment, ICommentModel>(
  {
    comment_userId: {
      type: Schema.Types.ObjectId,
      ref: SHOP.DOCUMENT_NAME,
      required: true,
    },
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: PRODUCT.DOCUMENT_NAME,
      required: true,
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: COMMENT.DOCUMENT_NAME,
      default: null,
    },
    comment_left: {
      type: Number,
      required: true,
    },
    comment_right: {
      type: Number,
      required: true,
    },
    comment_content: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COMMENT.COLLECTION_NAME,
  }
);

commentSchema.statics.build = async (
  attrs: ICommentAttrs
): Promise<IComment> => {
  return CommentModel.create(formatAttributeName(attrs, COMMENT.PREFIX));
};

export const CommentModel = model<IComment, ICommentModel>(
  COMMENT.DOCUMENT_NAME,
  commentSchema
);
