import {
  ProductModel,
  ClothingModel,
  ElectronicModel,
  FurnitureModel,
} from '../models/product.model';
import { getInfoData } from '../utils';
import { BadRequestError, InternalServerError } from '../core/errors';
import {
  getAllDraftProducts,
  getAllProducts,
  publishProduct,
  unpublishProduct,
  searchProducts,
} from '../models/repositories/product.repo';
import { IProduct, IProductAttrs } from '../interfaces/product.interface';

abstract class Product {
  static async createProduct(product: IProductAttrs): Promise<IProduct> {
    return await ProductModel.build(product);
  }
}

class Electronic extends Product {
  static async createProduct(product: IProductAttrs) {
    const newElectronic = await ElectronicModel.create({
      ...product.attributes,
      shop: product.shop,
    });
    if (!newElectronic) throw new InternalServerError('Server error::: Cannot create new product!');

    product._id = newElectronic._id;
    const newProduct = await super.createProduct(product);
    if (!newProduct) throw new InternalServerError('Server error:::: Cannot create new product!');

    return newProduct;
  }
}

class Clothing extends Product {
  static async createProduct(product: IProductAttrs) {
    const newClothing = await ClothingModel.create({ ...product.attributes, shop: product.shop });
    if (!newClothing) throw new InternalServerError('Server error::: Cannot create new product!');

    product._id = newClothing._id;
    const newProduct = await super.createProduct(product);
    if (!newProduct) throw new InternalServerError('Server error:::: Cannot create new product!');

    return newProduct;
  }
}

class Furniture extends Product {
  static async createProduct(product: IProductAttrs) {
    const newFurniture = await FurnitureModel.create({ ...product.attributes, shop: product.shop });
    if (!newFurniture) throw new InternalServerError('Server error::: Cannot create new product!');

    product._id = newFurniture._id;
    const newProduct = await super.createProduct(product);
    if (!newProduct) throw new InternalServerError('Server error:::: Cannot create new product!');

    return newProduct;
  }
}

const productStrategy = {
  Electronic,
  Furniture,
  Clothing,
};

class ProductFactory {
  static productsRegistered: Record<string, Product>;

  static registerProduct(productTypes: Record<string, Product>) {
    Object.keys(productTypes).forEach((productType) => {
      // @ts-ignore
      if (!productTypes[productType] instanceof Product)
        throw new InternalServerError('Fail to register new product type!');
    });

    this.productsRegistered = { ...this.productsRegistered, ...productTypes };
  }

  static async createProduct(product: IProductAttrs) {
    if (!Object.keys(productStrategy).includes(product.type))
      throw new BadRequestError(`Product type "${product.type}" is not supported!`);

    const newProduct = await productStrategy[product.type].createProduct(product);

    return getInfoData(newProduct.toObject(), {
      without: ['isDraft', 'isPublished', '__v', 'createdAt', 'updatedAt'],
    });
  }

  static async getAllDraftProducts({ shop, limit = 60, skip = 0 }: IProductQuery) {
    return getAllDraftProducts({ shop }, { limit, skip });
  }

  static async getAllProducts({ shop, limit = 60, skip = 0 }: IProductQuery) {
    return getAllProducts({ shop }, { limit, skip });
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

  static async updateProduct(shop: string, productId: string) {
    return unpublishProduct(shop, productId);
  }
}

interface IProductQuery {
  shop: string;
  limit?: string | number;
  skip?: string | number;
}

ProductFactory.registerProduct(productStrategy);

export { ProductFactory as ProductService };
