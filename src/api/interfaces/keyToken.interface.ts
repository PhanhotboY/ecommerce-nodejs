import { Model, Schema } from 'mongoose';

export interface IKeyToken {
  _id: string;
  user: string;
  publicKey: string;
  privateKey: string;
  refreshTokensUsed: string[];
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

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
