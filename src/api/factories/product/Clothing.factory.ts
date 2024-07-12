import { ProductFactoryAbstract } from '.';
import { ProductStrategy } from './Product.factory';
import { ClothingModel } from '../../models/product.model';
import { IProductAttrs } from '../../interfaces/product.interface';
import { InternalServerError } from '../../core/errors/InternalServerError';
import { formatAttributeName } from '../../utils';
import { PRODUCT } from '../../constants';

class ClothingStrategy extends ProductStrategy {
  static async createProduct(product: IProductAttrs) {
    const newClothing = await ClothingModel.create({
      ...formatAttributeName(product.attributes, PRODUCT.PREFIX),
      product_shop: product.shop,
    });
    if (!newClothing)
      throw new InternalServerError(
        'Server error::: Cannot create new product!'
      );

    product._id = newClothing._id;
    return await super.createProduct(product);
  }

  static async updateProduct(
    shop: string,
    productId: string,
    payload: IProductAttrs
  ) {
    if (payload.attributes)
      await ClothingModel.findOneAndUpdate(
        { _id: productId },
        formatAttributeName(payload.attributes, PRODUCT.PREFIX),
        {
          new: true,
        }
      ).lean();

    return await super.updateProduct(shop, productId, payload);
  }

  static async destroyProduct(shop: string, productId: string) {
    const result = await ClothingModel.deleteOne({
      shop,
      _id: productId,
    }).lean();
    if (!result)
      throw new InternalServerError(
        'Server error:::: Cannot delete the product!'
      );

    const deleteResult = await super.destroyProduct(shop, productId);
    if (!deleteResult)
      throw new InternalServerError(
        'Server error:::: Cannot delete the product!'
      );

    return deleteResult;
  }
}

export class ClothingFactory extends ProductFactoryAbstract {
  createStrategy() {
    return ClothingStrategy;
  }
}
