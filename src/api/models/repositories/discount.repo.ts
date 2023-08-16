import { Types } from 'mongoose';

import { DiscountModel } from '../discount.model';

const findDiscountByCode = async (code: string, shopId: string) => {
  return await DiscountModel.findOne({ code, shopId: new Types.ObjectId(shopId) }).lean();
};

export { findDiscountByCode };
