import { flattenObj } from '../../utils';
import { ProductModel } from '../../models/product.model';
import { InternalServerError } from '../../core/errors/InternalServerError';
import { IProduct, IProductAttrs } from '../../interfaces/product.interface';
import { insertInventory } from '../../models/repositories/inventory.repo';

export class ProductStrategy {
  static async createProduct(product: IProductAttrs): Promise<IProduct> {
    const newProduct = await ProductModel.build(product);
    if (!newProduct) throw new InternalServerError('Server error:::: Cannot create new product!');

    Promise.resolve(
      insertInventory({
        productId: newProduct._id,
        shopId: newProduct.shop,
        location: 'unknown',
        stock: newProduct.quantity,
      })
    );

    return newProduct;
  }

  static async updateProduct(shop: string, productId: string, payload: IProductAttrs) {
    const { type, shop: shopId, ...update } = payload;
    // delete (payload as Partial<IProductAttrs>).type

    return await ProductModel.findOneAndUpdate({ shop, _id: productId }, flattenObj(update), {
      new: true,
    }).lean();
  }

  static async destroyProduct(shop: string, productId: string) {
    return await ProductModel.deleteOne({ shop, _id: productId }).lean();
  }
}
