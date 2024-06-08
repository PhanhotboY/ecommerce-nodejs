import { ShopModel } from '../models/shop.model';
import { IShop } from '../interfaces/shop.interface';
import { findById, findByEmail } from '../models/repositories/shop.repo';

const findShopByEmail = async (email: string) => {
  return await findByEmail(email);
};

const findShopById = async (id: string) => {
  return await findById(id);
};

export { findShopByEmail, findShopById };
