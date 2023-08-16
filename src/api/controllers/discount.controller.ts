import { NextFunction, Request, Response } from 'express';

import { OK } from '../core/success.response';
import { DiscountService } from '../services/discount.service';
import { getInfoData } from '../utils';

export class DiscountController {
  static async createDiscount(req: Request, res: Response, next: NextFunction) {
    const result = await DiscountService.createDiscount(req.user.userId, req.body);

    OK({
      res,
      message: 'Create new discount successfully!',
      metadata: getInfoData(result.toObject(), { without: ['__v'] }),
      link: {
        self: { href: '/api/v1/discounts', method: 'POST' },
      },
    });
  }

  static async getApplicableProducts(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const { code, shopId, limit, page }: Record<string, string | number> = req.query;
    const result = await DiscountService.getAllApplicableProducts(
      code as string,
      shopId as string,
      limit as number,
      page as number
    );

    OK({
      res,
      message: 'Get all applicable products for discount code successfully!',
      metadata: getInfoData(result, {}),
      link: {
        self: { href: '/api/v1/discounts', method: 'GET' },
      },
    });
  }
}
