import { ShopModel } from '../shop.model';

const findByEmail = async (email: string) => {
  return await ShopModel.findOne({ email }).lean();
};

const findById = async (id: string) => {
  return await ShopModel.findById(id).lean();
};

export { findByEmail, findById };
