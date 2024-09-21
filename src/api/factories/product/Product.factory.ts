import { flattenObj, formatAttributeName } from '../../utils';
import { ProductModel } from '../../models/product.model';
import { InternalServerError } from '../../core/errors/InternalServerError';
import { IProduct, IProductAttrs } from '../../interfaces/product.interface';
import { insertInventory } from '../../models/repositories/inventory.repo';
import { PRODUCT } from '../../constants';

export class ProductStrategy {
  static async createProduct(product: IProductAttrs): Promise<IProduct> {
    const newProduct = await ProductModel.build(
      formatAttributeName(product, PRODUCT.PREFIX)
    );
    if (!newProduct)
      throw new InternalServerError(
        'Server error:::: Cannot create new product!'
      );

    await insertInventory({
      productId: newProduct._id,
      shopId: newProduct.product_shop,
      location: 'unknown',
      stock: newProduct.product_quantity,
    });

    return newProduct;
  }

  static async updateProduct(
    shop: string,
    productId: string,
    payload: IProductAttrs
  ) {
    const { type, shop: shopId, ...update } = payload;
    // delete (payload as Partial<IProductAttrs>).type

    return await ProductModel.findOneAndUpdate(
      { product_shop: shop, _id: productId },
      flattenObj(formatAttributeName(update, PRODUCT.PREFIX)),
      {
        new: true,
      }
    ).lean();
  }

  static async destroyProduct(shop: string, productId: string) {
    return await ProductModel.deleteOne({ shop, _id: productId }).lean();
  }
}
