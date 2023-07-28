import { Model } from 'mongoose';

export interface IApiKey {
  _id: string;
  key: string;
  status: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiKeyAttrs {
  key: string;
  permissions: string[];
}

export interface IApiKeyModel extends Model<IApiKey> {
  build(attrs: IApiKeyAttrs): Promise<IApiKey>;
}
