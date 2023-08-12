import { HydratedDocument, Model } from 'mongoose';

interface IRawShop {
  _id: string;
  name: string;
  email: string;
  password: string;
  msisdn: string;
  status: 'active' | 'inactive';
  verify: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type IShop = HydratedDocument<IRawShop>;

export interface IShopAttrs {
  name: string;
  email: string;
  password: string;
  msisdn: string;
  status?: 'active' | 'inactive';
  verify?: boolean;
  roles?: string[];
}

export interface IShopJWTPayload {
  userId: string;
  email: string;
}

export interface IShopResponseData {
  name: string;
  email: string;
  status: 'active' | 'inactive';
  verify: boolean;
}

export interface IShopModel extends Model<IShop> {
  build(attrs: IShopAttrs): Promise<IShop>;
}
