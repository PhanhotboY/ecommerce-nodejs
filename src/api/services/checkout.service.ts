import { isNullish } from '../utils';
import { BadRequestError, InternalServerError } from '../core/errors';
import { DiscountService } from './discount.service';
import { findCart } from '../models/repositories/cart.repo';
import { validateChecoutProducts } from '../models/repositories/product.repo';
import './redis.service';
import { acquireLock, releaseLock } from './redis.service';

interface ICheckoutProduct {
  productId: string;
  quantity: number;
  price: number;
}
interface ICheckoutOrder {
  shopId: string;
  discountCode: string;
  products: ICheckoutProduct[];
}

export class CheckoutService {
  /**
    {
        userId,
        cartId,
        orders: [
            {
                shopId,
                discountCode: 'code',
                products: [
                    {
                        productId,
                        quantity,
                        price
                    }
                ]
            },{
                shopId,
                discountCode: 'code',
                products: [
                    {
                        productId,
                        quantity,
                        price
                    }
                ]
            }
        ]
    }
     */
  static async checkoutReview(userId: string, orders: ICheckoutOrder[] = []) {
    const foundCart = await findCart(userId);
    if (!foundCart) throw new BadRequestError('Cart does not exist!');

    const orderDetails = {
      totalPrice: 0,
      shipping: 0,
      totalDiscount: 0,
      final: 0,
    };
    const finalOrders: ICheckoutOrder[] = [];

    for (const order of orders) {
      const products = (await validateChecoutProducts(
        order.shopId,
        order.products
      )) as ICheckoutProduct[];

      if (products.some((prod) => isNullish(prod)))
        throw new BadRequestError('Check out data is error!');

      const totalPrice = products.reduce((total, prod) => total + prod!.price * prod!.quantity, 0);

      orderDetails.totalPrice += totalPrice;

      if (order.discountCode) {
        const result = await DiscountService.useDiscount(order.discountCode, userId, products);

        orderDetails.totalDiscount += result.discount;
        orderDetails.final += result.final;
      } else orderDetails.final += totalPrice;

      finalOrders.push({ ...order, products: products });
    }

    return { orderDetails, finalOrders };
  }

  static async createOrder(userId: string, orders: ICheckoutOrder[], address = {}, payment = {}) {
    const { orderDetails, finalOrders } = await this.checkoutReview(userId, orders);
    let isAllReserved = true;
    const products = orders.flatMap((order) => order.products);
    console.log('product array::::', products);
    products.forEach(async (prod) => {
      const { productId, quantity } = prod;
      const keyLock = await acquireLock(userId, productId, quantity);

      if (keyLock) {
        // await releaseLock(keyLock);
      } else isAllReserved = false;
    });

    if (!isAllReserved)
      throw new BadRequestError('Some items have been updated. Please check again!');

    // create new order in DB

    throw new InternalServerError('This function is being developed!');
  }
}
