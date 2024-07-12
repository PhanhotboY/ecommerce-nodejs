import { NextFunction, Request, Response } from 'express';

import { getReturnData } from '../utils';
import { OK } from '../core/success.response';
import { CartService } from '../services/cart.service';

export class CartController {
  static async addToCart(req: Request, res: Response, next: NextFunction) {
    const result = await CartService.addToCart(
      req.user.userId,
      req.body.product
    );

    OK({
      res,
      message: 'Add product to cart successfully!',
      metadata: getReturnData(result, { without: ['__v'] }),
      link: {
        self: { href: '/api/v1/cart', method: 'POST' },
      },
    });
  }

  static async getCartDetails(req: Request, res: Response, next: NextFunction) {
    const result = await CartService.getCartDetails(req.user.userId);

    OK({
      res,
      message: 'Get all products from cart successfully!',
      metadata: getReturnData(result, { without: ['__v'] }),
      link: {
        self: { href: '/api/v1/cart', method: 'GET' },
      },
    });
  }

  static async updateCart(req: Request, res: Response, next: NextFunction) {
    const result = await CartService.updateCart(
      req.user.userId,
      req.body.product
    );

    OK({
      res,
      message: 'Add product to cart successfully!',
      metadata: getReturnData(result, { without: ['__v'] }),
      link: {
        self: { href: '/api/v1/cart/update', method: 'POST' },
      },
    });
  }
}
