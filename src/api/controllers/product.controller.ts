import { NextFunction, Request, Response } from 'express';
import { OK } from '../core/success.response';
import { ProductService } from '../services/product.service';
import { BadRequestError } from '../core/errors';

const patchProduct = {
  unpublishProduct: ProductService.unpublishProduct,
  publishProduct: ProductService.publishProduct,
  updateProduct: ProductService.getAllProducts,
};

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Create product successfully!!',
      metadata: await ProductService.createProduct({ ...req.body, shop: req.user.userId }),
      options: {},
      link: {
        getAllDrafts: { href: '/api/v1/products/drafts?limit=60&skip=0', method: 'GET' },
      },
    });
  }

  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Get all products successfully!',
      metadata: await ProductService.getAllProducts({
        shop: req.user.userId,
        limit: req.query.limit as string,
        skip: req.query.skip as string,
      }),
      link: {
        self: { href: '/api/v1/products', method: 'GET' },
      },
    });
  }

  static async getAllDrafts(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Get all draft products successfully!',
      metadata: await ProductService.getAllDraftProducts({ shop: req.user.userId }),
      link: {
        self: { href: '/api/v1/products/draft', method: 'GET' },
        'search-product': { href: '/api/v1/products', method: 'GET' },
      },
    });
  }

  static async searchProducts(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Search product successfully!',
      metadata: await ProductService.searchProducts(req.params.search as string),
      link: {
        self: { href: '/api/v1/products/search/:search', method: 'GET' },
        'search-product': { href: '/api/v1/products', method: 'GET' },
      },
    });
  }

  static async patchProduct(req: Request, res: Response, next: NextFunction) {
    const action = req.body.op as string;
    if (!Object.keys(patchProduct).includes(action))
      throw new BadRequestError(`The operation "${action}" does not supported!`);

    OK({
      res,
      message: `Action operated successfully!`,
      // @ts-ignore
      metadata: await patchProduct[action](req.user.userId, req.params.productId),
      link: {
        self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        'search-product': { href: '/api/v1/products/:search', method: 'GET' },
      },
    });
  }
}
