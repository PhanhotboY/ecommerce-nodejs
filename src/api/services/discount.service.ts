import { getSkipNumber } from '../utils';
import { ProductService } from './product.service';
import { DiscountModel } from '../models/discount.model';
import { IDiscountAttrs } from '../interfaces/discount.interface';
import { BadRequestError, InternalServerError } from '../core/errors';
import { findDiscountByCode } from '../models/repositories/discount.repo';
import { getAllProducts } from '../models/repositories/product.repo';

export class DiscountService {
  static async createDiscount(shop: string, payload: IDiscountAttrs) {
    validateDate(payload.start_date, payload.end_date);

    const foundDiscount = await DiscountModel.findOne({
      code: payload.code,
    }).lean();
    if (foundDiscount) throw new BadRequestError('Discount already exist!');

    const newDiscount = await DiscountModel.build({ ...payload, shopId: shop });
    if (!newDiscount) throw new InternalServerError('Cannot create new discount!');

    return newDiscount;
  }

  static async updateDiscount() {}

  static async getAllApplicableProducts(code: string, shopId: string, limit: number, page: number) {
    const foundDiscount = await findDiscountByCode(code, shopId);
    if (!foundDiscount || !foundDiscount.isActive)
      throw new BadRequestError('Discount is unavailable!');

    if (foundDiscount.apply_type === 'all') {
      return await ProductService.getAllProducts({
        shop: foundDiscount.shopId as string,
        limit,
        skip: getSkipNumber(limit, page),
      });
    }

    return await getAllProducts(
      { _id: { $in: foundDiscount.product_ids } },
      { limit, skip: getSkipNumber(limit, page) }
    );
  }
}

const validateDate = (startDate: Date, endDate: Date) => {
  if (new Date() < new Date(startDate) && new Date() > new Date(endDate))
    throw new BadRequestError('Invalid start or end date!');

  if (new Date(startDate) > new Date(endDate))
    throw new BadRequestError('Start date must be before end date!');
};
