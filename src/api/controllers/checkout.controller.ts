import { NextFunction, Request, Response } from 'express';
import { CheckoutService } from '../services/checkout.service';
import { OK } from '../core/success.response';

export class CheckoutController {
  static async reviewCheckout(req: Request, res: Response, next: NextFunction) {
    const result = await CheckoutService.checkoutReview(req.user.userId, req.body.orders);

    OK({
      res,
      message: 'Review checkout successfully!',
      metadata: result,
      link: {
        self: { href: '/api/v1/checkout/review', method: 'POST' },
      },
    });
  }

  static async createOrder(req: Request, res: Response, next: Function) {
    const result = await CheckoutService.createOrder(req.user.userId, req.body.orders);

    OK({
      res,
      message: 'Create order successfully!',
      metadata: {},
      link: {
        self: { href: '/api/v1/checkout', method: 'POST' },
      },
    });
  }
}
