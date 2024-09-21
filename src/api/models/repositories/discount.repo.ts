import { Types } from 'mongoose';

import { DiscountModel } from '../discount.model';
import { getSkipNumber } from '../../utils';

const getDiscountByCode = async (code: string) => {
  return await DiscountModel.findOne({ code }).lean();
};

const getDiscountCodes = async (
  shopId: string,
  limit: string | number = 50,
  page: string | number = 1
) => {
  return await DiscountModel.find({ shopId: new Types.ObjectId(shopId), isActive: true })
    .select('-__v -shopId')
    .skip(getSkipNumber(+limit || 50, +page || 1))
    .limit(+limit || 50)
    .lean();
};

const updateDiscount = async (filter: Object, payload: Object) => {
  return DiscountModel.findOneAndUpdate(filter, payload, { new: true }).lean();
};

const deleteDiscount = async (filter: { shopId: string; code: string }) => {
  return DiscountModel.findOneAndDelete(filter).lean();
};

export { getDiscountByCode, getDiscountCodes, deleteDiscount, updateDiscount };
