import { ProductService } from './product.service';
import { DiscountModel } from '../models/discount.model';
import { IDiscountAttrs } from '../interfaces/discount.interface';
import { BadRequestError, InternalServerError, NotFoundError } from '../core/errors';
import {
  deleteDiscount,
  getDiscountByCode,
  getDiscountCodes,
  updateDiscount,
} from '../models/repositories/discount.repo';
import { getAllProducts } from '../models/repositories/product.repo';
import { GoneError } from '../core/errors/GoneError';
import { Types } from 'mongoose';

interface IQueryOptions {
  limit?: string | number;
  page?: string | number;
}

interface IOrder {
  productId: string;
  price: number;
  quantity: number;
  shopId?: string;
}

export class DiscountService {
  static async createDiscount(shop: string, payload: IDiscountAttrs) {
    validateDate(payload.start_date, payload.end_date);

    const foundDiscount = await getDiscountByCode(payload.code);
    if (foundDiscount) throw new BadRequestError('Discount already exist!');

    const newDiscount = await DiscountModel.build({ ...payload, shopId: shop });
    if (!newDiscount) throw new InternalServerError('Cannot create new discount!');

    return newDiscount;
  }

  static async updateDiscount(code: string, shopId: string, payload: Partial<IDiscountAttrs>) {
    return await updateDiscount({ code, shopId }, payload);
  }

  static async getAllApplicableProducts(code?: string, options?: IQueryOptions) {
    if (!code) throw new BadRequestError('Discount does not exist!');

    const foundDiscount = await getDiscountByCode(code);
    if (!foundDiscount || !foundDiscount.isActive)
      throw new BadRequestError('Discount is unavailable!');

    if (foundDiscount.apply_type === 'all') {
      return await ProductService.getAllProducts({
        shop: foundDiscount.shopId as string,
        ...options,
      });
    }

    return await getAllProducts({ _id: { $in: foundDiscount.product_ids } }, options);
  }

  static async getAllDiscountCodes(shopId: string, { limit, page }: IQueryOptions) {
    return await getDiscountCodes(shopId, limit, page);
  }

  /**order: [{
   *  productId,
   *  price,
   *  quantity,
   *  shopId,
   *  name
   * }, {
   *  productId,
   *  price,
   *  quantity,
   *  shopId,
   *  name
   * }]
   */
  static async useDiscount(code: string, userId: string, products: Array<IOrder>) {
    const foundDiscount = await getDiscountByCode(code);
    if (!foundDiscount || !foundDiscount.isActive)
      throw new BadRequestError('Discount is unavailable!');

    if (new Date() < new Date(foundDiscount.start_date))
      throw new BadRequestError('Discount has not started yet!');
    if (new Date() > new Date(foundDiscount.end_date))
      throw new BadRequestError('Discount has expired!');

    if (foundDiscount.used_count >= foundDiscount.quantity) throw new GoneError('Discount is out!');

    // Check if all products are published
    // Check if products and discount code belong to the same shop

    const totalOrderAmount = products.reduce(
      (total, prod) => total + prod.price * prod.quantity,
      0
    );
    if (totalOrderAmount < foundDiscount.min_order_value)
      throw new BadRequestError(`Order value must be more than ${foundDiscount.min_order_value}!`);

    if (foundDiscount.quantity_per_user < 1) throw new BadRequestError('Discount is unavailable!');

    const userUsedCount = foundDiscount.used_users.reduce(
      (count, id) => (count += Number(id.toString() === userId)),
      0
    );
    if (userUsedCount >= foundDiscount.quantity_per_user)
      throw new BadRequestError('Discount is unusable!');

    // update discount
    await updateDiscount(
      { code: foundDiscount.code, shopId: foundDiscount.shopId },
      {
        $push: { used_users: userId },
        $inc: { used_count: 1 },
      }
    );

    const discount =
      foundDiscount.type === 'fixed_amount'
        ? foundDiscount.value
        : (totalOrderAmount * foundDiscount.value) / 100;

    return {
      total: totalOrderAmount,
      discount,
      final: totalOrderAmount - discount,
    };
  }

  static async cancelDiscount(code: string, userId: string) {
    const foundDiscount = await getDiscountByCode(code);
    if (!foundDiscount) throw new NotFoundError('Discount not found!');

    if (!foundDiscount.used_users.find((id) => id.toString() === userId))
      throw new BadRequestError('Unused discount!');

    const result = await updateDiscount(
      { code: foundDiscount.code, shopId: foundDiscount.shopId },
      {
        $pull: { used_users: { $in: [userId] } },
        $inc: { used_count: -1 },
      }
    );
    if (!result) throw new InternalServerError('Cannot cancel using discount!');

    return result;
  }

  static async deleteDiscount(code: string, shop: string) {
    const result = await deleteDiscount({ code, shopId: shop });
    if (!result) throw new InternalServerError('Cannot delete discount!');

    return result;
  }
}

const validateDate = (startDate: Date, endDate: Date) => {
  if (new Date() < new Date(startDate) && new Date() > new Date(endDate))
    throw new BadRequestError('Invalid start or end date!');

  if (new Date(startDate) > new Date(endDate))
    throw new BadRequestError('Start date must be before end date!');
};
