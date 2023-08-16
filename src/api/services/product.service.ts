import {
  searchProducts,
  publishProduct,
  getAllProducts,
  unpublishProduct,
  deleteProduct,
  restoreProduct,
  getAllDraftProducts,
  getAllDeletedProducts,
  findProduct,
  getProductDetails,
} from '../models/repositories/product.repo';
import { getInfoData, removeNestedNullish } from '../utils';
import { IProductAttrs } from '../interfaces/product.interface';
import { InternalServerError } from '../core/errors';
import { ProductFactory } from '../factories/product';

class ProductService {
  static async createProduct(product: IProductAttrs) {
    const Strategy = ProductFactory.createStrategy(product.type);

    const newProduct = await Strategy.createProduct(product);

    return getInfoData(newProduct.toObject(), {
      without: ['__v', 'createdAt', 'updatedAt'],
    });
  }

  static async getAllProducts({ limit = 50, skip = 0 }: IProductQuery) {
    return getAllProducts({}, { limit, skip });
  }

  static async getAllDraftProducts({ shop, limit = 50, skip = 0 }: IProductQuery) {
    return getAllDraftProducts({ shop }, { limit, skip });
  }

  static async getAllDeletedProducts({ shop, limit = 50, skip = 0 }: IProductQuery) {
    return getAllDeletedProducts({ shop }, { limit, skip });
  }

  static async getAllPublished({ shop, limit = 50, skip = 0 }: IProductQuery) {
    return getAllProducts({ shop }, { limit, skip });
  }

  static async getProductDetails(productId: string, shop?: string) {
    return getProductDetails(productId, shop);
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

  static async updateProduct(shop: string, productId: string, payload: IProductAttrs) {
    const foundProduct = await findProduct(shop, productId);

    const ProductStrategy = ProductFactory.createStrategy(foundProduct.type);

    const update = await ProductStrategy.updateProduct(
      shop,
      productId,
      removeNestedNullish(payload)
    );
    if (!update) throw new InternalServerError('Update product fail!!');

    return getInfoData(update, {
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
    const foundProduct = await findProduct(shop, productId, true);

    const Strategy = ProductFactory.createStrategy(foundProduct.type);

    const result = await Strategy.destroyProduct(shop, productId);

    return getInfoData(result, {
      without: ['__v', 'createdAt', 'updatedAt'],
    });
  }
}

// init factories
import '../factories/product';

interface IProductQuery {
  shop?: string;
  limit?: string | number;
  skip?: string | number;
}

export { ProductService };
