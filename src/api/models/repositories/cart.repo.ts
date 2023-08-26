import { Types } from 'mongoose';

import { CartModel } from '../cart.model';
import { ICartAttrs } from '../../interfaces/cart.interface';

const createCart = async (attrs: ICartAttrs) => {
  return CartModel.build(attrs);
};

const updateCart = async (filter: Object, update: Object, options?: Object) => {
  return CartModel.findOneAndUpdate(filter, update, { new: true, ...options }).lean();
};

const findCart = async (userId: string, filter?: Object) => {
  return CartModel.findOne({ userId: new Types.ObjectId(userId), ...filter }, { __v: 0 }).lean();
};

export { findCart, createCart, updateCart };
