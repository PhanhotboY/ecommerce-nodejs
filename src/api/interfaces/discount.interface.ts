import { ObjectId, HydratedDocument, Model } from 'mongoose';

export interface IRawDiscount {
  _id: string;
  name: string;
  description: string;
  type: 'fixed_amount' | 'percentage';
  code: string;
  value: number;
  start_date: Date;
  end_date: Date;
  quantity: number;
  used_count: number;
  used_users: string[];
  quantity_per_user: number;
  min_order_value: number;
  shopId: string | ObjectId;
  isActive: boolean;
  apply_type: 'all' | 'specific';
  product_ids: string[];
}

export interface IDiscount extends HydratedDocument<IRawDiscount> {}

export interface IDiscountAttrs
  extends Omit<IRawDiscount, '_id' | 'used_count' | 'used_user' | 'isActive' | 'product_ids'> {}

export interface IDiscountModel extends Model<IDiscount> {
  build(attrs: IDiscountAttrs): Promise<IDiscount>;
}
