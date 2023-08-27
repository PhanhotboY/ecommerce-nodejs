import { SHOP } from '../constants';

export type IShopStatus = (typeof SHOP.STATUS)[keyof typeof SHOP.STATUS];

export interface Shop {
  id?: string;
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
