import { Model, HydratedDocument } from 'mongoose';

interface IRawApiKey {
  _id: string;
  key: string;
  status: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type IApiKey = HydratedDocument<IRawApiKey>;

export interface IApiKeyAttrs {
  key: string;
  permissions: string[];
}

export interface IApiKeyModel extends Model<IApiKey> {
  build(attrs: IApiKeyAttrs): Promise<IApiKey>;
}
