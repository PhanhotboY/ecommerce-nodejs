import { HydratedDocument, Model } from 'mongoose';
import { SHOP } from '../constants';

interface IRawShop {
  _id: string;
  name: string;
  email: string;
  password: string;
  msisdn: string;
  status: Values<typeof SHOP.STATUS>;
  verify: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IShop = HydratedDocument<IRawShop>;

export interface IShopAttrs {
  name: string;
  email: string;
  password: string;
  msisdn: string;
  status?: IShop['status'];
  verify?: boolean;
}

export interface IShopJWTPayload {
  userId: string;
  email: string;
}

export interface IShopResponseData {
  name: string;
  email: string;
  status: IShop['status'];
  verify: boolean;
}

export interface IShopModel extends Model<IShop> {
  build(attrs: IShopAttrs): Promise<IShop>;
}
