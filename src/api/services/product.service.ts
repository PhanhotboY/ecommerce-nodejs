import {
  findProduct,
  deleteProduct,
  searchProducts,
  publishProduct,
  getAllProducts,
  restoreProduct,
  unpublishProduct,
  getProductDetails,
  getAllDeletedProducts,
  getProductDetailsForShop,
} from '../models/repositories/product.repo';
import { BadRequestError } from '../core/errors';
import { InternalServerError } from '../core/errors';
import { ProductFactory } from '../factories/product';
import { getReturnData, getReturnList, removeNestedNullish } from '../utils';
import { IProductAttrs } from '../interfaces/product.interface';

export class ProductService {
  static async createProduct(product: IProductAttrs) {
    const Strategy = ProductFactory.createStrategy(product.type);

    const newProduct = await Strategy.createProduct(product);

    return getReturnData(newProduct, {
      without: ['__v', 'createdAt', 'updatedAt'],
    });
  }

  static async getAllProducts({ limit, page }: IProductQuery) {
    return getAllProducts({}, { limit, page });
  }

  static async getAllPublished({ shop, limit, page }: IProductQuery) {
    return getAllProducts({ product_shop: shop }, { limit, page });
  }

  static async getAllDraftProducts({ shop, limit, page }: IProductQuery) {
    return getAllProducts(
      { product_shop: shop, isPublished: false },
      { limit, page }
    );
  }

  static async getAllDeletedProducts({ shop, limit, page }: IProductQuery) {
    return getAllDeletedProducts({ product_shop: shop }, { limit, page });
  }

  static async getProductDetails(productId: string) {
    return getProductDetails(productId);
  }

  static async getProductDetailsForShop(productId: string, shopId: string) {
    return getProductDetailsForShop(productId, shopId);
  }

  static async searchProducts(search: string) {
    return searchProducts(search);
  }

  static async publishProduct(shop: string, productId: string) {
    return publishProduct(shop, productId);
  }

  static async unpublishProduct(shop: string, productId: string) {
    return unpublishProduct(shop, productId);
  }

  static async updateProduct(
    shop: string,
    productId: string,
    payload: IProductAttrs
  ) {
    const foundProduct = await findProduct({ shop, _id: productId });
    if (!foundProduct) throw new BadRequestError('Product does not exist!');

    const ProductStrategy = ProductFactory.createStrategy(
      foundProduct.product_type
    );

    const update = await ProductStrategy.updateProduct(
      shop,
      productId,
      removeNestedNullish(payload)
    );
    if (!update) throw new InternalServerError('Update product fail!!');

    return getReturnData(update.toObject(), {
      without: ['__v'],
    });
  }

  static async restoreProduct(shop: string, productId: string) {
    return restoreProduct(shop, productId);
  }

  static async deleteProduct(shop: string, productId: string) {
    return deleteProduct(shop, productId);
  }

  static async destroyProduct(shop: string, productId: string) {
    const foundProduct = await findProduct({ shop, _id: productId }, true);
    if (!foundProduct) throw new BadRequestError('Product does not exist!');

    const Strategy = ProductFactory.createStrategy(foundProduct.product_type);

    const result = await Strategy.destroyProduct(shop, productId);

    return getReturnData(result, {
      without: ['__v', 'createdAt', 'updatedAt'],
    });
  }
}

// init factories
import '../factories/product';

interface IProductQuery {
  shop?: string;
  limit?: string | number;
  page?: string | number;
}
