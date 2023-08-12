import { ShopModel } from '../models/shop.model';
import { IShop } from '../interfaces/shop.interface';

const findByEmail = async (email: string) => {
  return await ShopModel.findOne<IShop>({ email }).lean();
};

export { findByEmail };
