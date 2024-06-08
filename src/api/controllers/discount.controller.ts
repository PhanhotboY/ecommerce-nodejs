import { NextFunction, Request, Response } from 'express';

import { OK } from '../core/success.response';
import { DiscountService } from '../services/discount.service';
import { getReturnData, getReturnList } from '../utils';
import { BadRequestError } from '../core/errors';

const patchDiscount = {
  cancelDiscount: DiscountService.cancelDiscount,
};

export class DiscountController {
  static async createDiscount(req: Request, res: Response, next: NextFunction) {
    const result = await DiscountService.createDiscount(
      req.user.userId,
      req.body
    );

    OK({
      res,
      message: 'Create new discount successfully!',
      metadata: getReturnData(result, { without: ['__v'] }),
      link: {
        self: { href: '/api/v1/discounts', method: 'POST' },
      },
    });
  }

  static async getApplicableProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { limit, page } = req.query as Partial<Record<string, string>>;
    const { code } = req.params;
    const result = await DiscountService.getAllApplicableProducts(code, {
      limit,
      page,
    });

    OK({
      res,
      message: 'Get all applicable products for discount code successfully!',
      metadata: getReturnList(result),
      link: {
        self: { href: '/api/v1/discounts', method: 'GET' },
      },
    });
  }

  static async getAllDiscountCodes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { shopId, limit, page } = req.query as Partial<
      Record<string, string>
    >;
    const result = await DiscountService.getAllDiscountCodes(shopId as string, {
      limit,
      page,
    });

    OK({
      res,
      message: 'Get all discount codes of shop successfully!',
      metadata: getReturnList(result),
      link: {
        self: { href: '/api/v1/discounts?shopId=&limit=&page=', method: 'GET' },
      },
    });
  }

  static async useDiscount(req: Request, res: Response, next: NextFunction) {
    const result = await DiscountService.useDiscount(
      req.params.code,
      req.user.userId,
      req.body.orders
    );

    OK({
      res,
      message: 'Use discount successfully!',
      metadata: result,
      link: {
        self: { href: '/api/v1/discounts?shopId=&limit=&page=', method: 'GET' },
      },
    });
  }

  static async patchDiscount(req: Request, res: Response, next: NextFunction) {
    const action = req.body.op as keyof typeof patchDiscount;

    if (!patchDiscount[action])
      throw new BadRequestError(
        `The operation "${action}" does not supported!`
      );

    const result = await patchDiscount[action](
      req.params.code,
      req.user.userId
    );

    OK({
      res,
      message: 'Delete product successfully!',
      metadata: getReturnData(result),
      link: {
        self: { href: '/api/v1/discounts/:code', method: 'DELETE' },
      },
    });
  }

  static async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    const result = await DiscountService.deleteDiscount(
      req.params.code,
      req.user.userId
    );

    OK({
      res,
      message: 'Delete product successfully!',
      metadata: getReturnData(result),
      link: {
        self: { href: '/api/v1/discounts/:code', method: 'DELETE' },
      },
    });
  }
}
