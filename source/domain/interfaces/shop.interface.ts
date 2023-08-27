import { Model } from 'mongoose';
import { SHOP } from '../constants';

export type IShopStatus = (typeof SHOP.STATUS)[keyof typeof SHOP.STATUS];

export interface IShop {
  _id: string;
  name: string;
  email: string;
  password: string;
  msisdn: string;
  status: IShopStatus;
  verify: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IShopAttrs {
  name: string;
  email: string;
  password: string;
  msisdn: string;
  status?: IShopStatus;
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
  status: IShopStatus;
  verify: boolean;
}

export interface IShopModel extends Model<IShop> {
  build(attrs: IShopAttrs): Promise<IShop>;
}
