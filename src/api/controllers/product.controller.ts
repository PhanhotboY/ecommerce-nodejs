import { NextFunction, Request, Response } from 'express';
import { OK } from '../core/success.response';
import { ProductService } from '../services/product.service';
import { BadRequestError } from '../core/errors';
import { getReturnData, getReturnList } from '../utils';

const patchProduct = {
  unpublishProduct: ProductService.unpublishProduct,
  publishProduct: ProductService.publishProduct,
  updateProduct: ProductService.updateProduct,
  deleteProduct: ProductService.deleteProduct,
  restoreProduct: ProductService.restoreProduct,
};

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    OK({
      res,
      message: 'Create product successfully!!',
      metadata: await ProductService.createProduct({
        ...req.body,
        shop: req.user.userId,
      }),
      options: {},
      link: {
        getAllDrafts: {
          href: '/api/v1/products/drafts?limit=50&skip=0',
          method: 'GET',
        },
      },
    });
  }

  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    const result = await ProductService.getAllProducts({
      limit: req.query.limit as string,
      page: req.query.skip as string,
    });

    OK({
      res,
      message: 'Get all products successfully!',
      metadata: getReturnList(result),
      link: {
        self: { href: '/api/v1/products?limit=50&skip=0', method: 'GET' },
      },
    });
  }

  static async getAllPublished(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const result = await ProductService.getAllPublished({
      shop: req.user.userId,
      limit: req.query.limit as string,
      page: req.query.skip as string,
    });

    OK({
      res,
      message: 'Get all published products successfully!',
      metadata: getReturnList(result),
      link: {
        self: { href: '/api/v1/products/published', method: 'GET' },
      },
    });
  }

  static async getAllDeteled(req: Request, res: Response, next: NextFunction) {
    const result = await ProductService.getAllDeletedProducts({
      shop: req.user.userId,
      limit: req.query.limit as string,
      page: req.query.page as string,
    });

    OK({
      res,
      message: 'Get all published products successfully!',
      metadata: getReturnList(result),
      link: {
        self: { href: '/api/v1/products/deleted', method: 'GET' },
      },
    });
  }

  static async getAllDrafts(req: Request, res: Response, next: NextFunction) {
    const result = await ProductService.getAllDraftProducts({
      shop: req.user.userId,
    });

    OK({
      res,
      message: 'Get all draft products successfully!',
      metadata: getReturnList(result),
      link: {
        self: { href: '/api/v1/products/draft', method: 'GET' },
        'search-product': { href: '/api/v1/products', method: 'GET' },
      },
    });
  }

  static async searchProducts(req: Request, res: Response, next: NextFunction) {
    const result = await ProductService.searchProducts(
      req.params.search as string
    );

    OK({
      res,
      message: 'Search product successfully!',
      metadata: getReturnList(result),
      link: {
        self: { href: '/api/v1/products/search/:search', method: 'GET' },
      },
    });
  }

  static async getProductDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const result = await ProductService.getProductDetails(req.params.productId);

    OK({
      res,
      message: `Action operated successfully!`,
      metadata: getReturnData(result || {}),
      link: {
        self: { href: '/api/v1/products/details/:productId', method: 'GET' },
        'search-product': { href: '/api/v1/products/:search', method: 'GET' },
      },
    });
  }

  static async getProductDetailsForShop(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const result = await ProductService.getProductDetailsForShop(
      req.params.productId,
      req.user.userId
    );

    OK({
      res,
      message: 'Action operated successfully!',
      metadata: getReturnData(result || {}),
      link: {
        self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        'search-product': { href: '/api/v1/products/:search', method: 'GET' },
      },
    });
  }

  static async patchProduct(req: Request, res: Response, next: NextFunction) {
    const action = req.body.op as keyof typeof patchProduct;

    if (!patchProduct[action])
      throw new BadRequestError(
        `The operation "${action}" does not supported!`
      );

    const result = await patchProduct[action](
      req.user.userId,
      req.params.productId,
      req.body.value
    );

    OK({
      res,
      message: `Action operated successfully!`,
      metadata: getReturnData(result),
      link: {
        self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        'search-product': { href: '/api/v1/products/:search', method: 'GET' },
      },
    });
  }

  static async destroyProduct(req: Request, res: Response, next: NextFunction) {
    const result = await ProductService.destroyProduct(
      req.user.userId,
      req.params.productId
    );

    OK({
      res,
      message: `Action operated successfully!`,
      metadata: getReturnData(result),
      link: {
        self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        'search-product': { href: '/api/v1/products/:search', method: 'GET' },
      },
    });
  }
}
