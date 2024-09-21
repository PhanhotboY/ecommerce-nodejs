import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { CART } from '../constants/cart.constant';

export interface IRawCart {
  _id: string | ObjectId;
  state: (typeof CART.STATE)[keyof typeof CART.STATE];
  products: ICartProduct[];
  total_count: number;
  userId: string | ObjectId;
}

export interface ICart extends HydratedDocument<IRawCart> {}

export interface ICartAttrs extends Omit<IRawCart, '_id' | 'total_count' | 'products'> {
  products?: ICartProduct[];
  total_count?: number;
}

export interface ICartProduct {
  productId: string | ObjectId;
  shopId: string | ObjectId;
  quantity: number;
  old_quantity?: number;
}

export interface ICartModel extends Model<ICart> {
  build(attrs: ICartAttrs): Promise<ICart>;
}
