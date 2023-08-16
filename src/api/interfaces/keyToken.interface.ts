import { Model, HydratedDocument, ObjectId } from 'mongoose';

interface IRawKeyToken {
  _id: string | ObjectId;
  user: string | ObjectId;
  publicKey: string;
  privateKey: string;
  refreshTokensUsed: string[];
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IKeyToken = HydratedDocument<IRawKeyToken>;

export interface IKeyTokenAttrs {
  user: string;
  publicKey: string;
  privateKey: string;
  refreshTokensUsed?: string[];
  refreshToken: string;
}

export interface IKeyTokenModel extends Model<IKeyToken> {
  build(attrs: IKeyTokenAttrs): Promise<IKeyToken>;
}
