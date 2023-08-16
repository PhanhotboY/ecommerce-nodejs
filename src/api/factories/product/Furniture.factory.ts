import { ProductFactoryAbstract } from '.';
import { ProductStrategy } from './Product.factory';
import { FurnitureModel } from '../../models/product.model';
import { IProductAttrs } from '../../interfaces/product.interface';
import { InternalServerError } from '../../core/errors/InternalServerError';

class FurnitureStrategy extends ProductStrategy {
  static async createProduct(product: IProductAttrs) {
    const newFurniture = await FurnitureModel.create({
      ...product.attributes,
      shop: product.shop,
    });
    if (!newFurniture) throw new InternalServerError('Server error::: Cannot create new product!');

    product._id = newFurniture._id;
    return await super.createProduct(product);
  }

  static async updateProduct(shop: string, productId: string, payload: IProductAttrs) {
    if (payload.attributes)
      await FurnitureModel.findOneAndUpdate({ _id: productId }, payload.attributes, {
        new: true,
      }).lean();

    return await super.updateProduct(shop, productId, payload);
  }

  static async destroyProduct(shop: string, productId: string) {
    const result = await FurnitureModel.deleteOne({ shop, _id: productId }).lean();
    if (!result) throw new InternalServerError('Server error:::: Cannot delete the product!');

    const deleteResult = await super.destroyProduct(shop, productId);
    if (!deleteResult) throw new InternalServerError('Server error:::: Cannot delete the product!');

    return deleteResult;
  }
}

export class FurnitureFactory extends ProductFactoryAbstract {
  createStrategy() {
    return FurnitureStrategy;
  }
}
