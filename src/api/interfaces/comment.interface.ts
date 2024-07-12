import { HydratedDocument, Model, ObjectId, Types } from 'mongoose';

export interface IRawComment {
  _id: string;
  comment_userId: string | ObjectId;
  comment_productId: string | ObjectId;
  comment_parentId: string | ObjectId;
  comment_left: number;
  comment_right: number;
  comment_content: string;
  isDeleted: boolean;
}

export interface ICommentAttrs {
  userId: string;
  productId: string;
  parentId: string;
  left: number;
  right: number;
  content: string;
}

export type IComment = HydratedDocument<IRawComment>;

export interface ICommentModel extends Model<IComment> {
  build(attrs: ICommentAttrs): Promise<IComment>;
}
