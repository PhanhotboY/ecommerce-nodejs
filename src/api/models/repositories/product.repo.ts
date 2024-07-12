import { Query, QuerySelector, Types, ObjectId } from 'mongoose';
import { ProductModel } from '../product.model';
import { BadRequestError, InternalServerError } from '../../core/errors';
import { IProduct, IRawProduct } from '../../interfaces/product.interface';
import { formatAttributeName, getSkipNumber } from '../../utils';
import { QueryOptions } from 'mongoose';
import { PRODUCT } from '../../constants';
import { filter } from 'lodash';

interface IProductFilter {
  shop?: IProduct['product_shop'];
  isDraft?: IProduct['product_isDraft'];
  isPublished?: IProduct['product_isPublished'];
  deletedAt?:
    | IProduct['product_deletedAt']
    | QuerySelector<IProduct['product_deletedAt']>
    | null;
  _id?: string | { $in: Array<any> };
}

interface IProductOption {
  limit?: string | number;
  page?: string | number;
  select?: Array<keyof IRawProduct>;
}

const getAllProducts = async (
  { isPublished = true, ...filter }: IProductFilter,
  options?: IProductOption
) => {
  return await queryProduct(
    { ...filter, isDraft: !isPublished, deletedAt: null },
    {
      ...options,
      select: [
        'product_name',
        'product_thumb',
        'product_price',
        'product_ratingsAverage',
        'product_slug',
      ],
    }
  );
};

const getAllDeletedProducts = async (
  filter: IProductFilter,
  options: IProductOption
) => {
  return await queryProduct(
    { ...filter, deletedAt: { $ne: null } },
    {
      ...options,
      select: [
        'product_name',
        'product_thumb',
        'product_price',
        'product_ratingsAverage',
        'product_slug',
        'product_deletedAt',
      ],
    }
  );
};

const getProductDetails = async (productId: string, shopId?: string) => {
  if (!productId) throw new BadRequestError('Product ID is required!');

  const result = await findProduct({
    _id: new Types.ObjectId(productId),
    ...(shopId ? { shop: new Types.ObjectId(shopId) } : {}),
    product_isPublished: true,
    product_isDraft: false,
  });

  return result;
};

const getProductDetailsForShop = async (productId: string, shopId: string) => {
  const result = await findProduct({
    _id: new Types.ObjectId(productId),
    product_shop: new Types.ObjectId(shopId),
  });

  return result;
};

const unpublishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({
    shop,
    _id: new Types.ObjectId(productId),
  });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct.updateOne({
    product_isDraft: true,
    product_isPublished: false,
  });
  if (!result) throw new InternalServerError('Cannot unpublish product!');

  return result;
};

const publishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({
    shop,
    _id: new Types.ObjectId(productId),
  });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct.updateOne({
    product_isDraft: false,
    product_isPublished: true,
  });
  if (!result) throw new InternalServerError('Cannot unpublish product!');

  return result;
};

const searchProducts = async (search: string) => {
  const result = await ProductModel.find(
    {
      $text: { $search: search },
      product_isDeleted: null,
      product_isPublished: true,
    },
    { score: { $meta: 'textScore' } }
  )
    .select('name thumb slug price ratingsAverage')
    .lean();

  return result;
};

const restoreProduct = async (shop: string, productId: string) => {
  const deletedProduct = await findProduct(
    { shop, _id: new Types.ObjectId(productId) },
    true
  );
  if (!deletedProduct) throw new BadRequestError('Product does not exist!');

  const result = await deletedProduct.updateOne({ product_deletedAt: null });
  if (!result) throw new InternalServerError('Restore product fail!');

  return result;
};

const deleteProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({ shop, _id: productId });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct
    .updateOne({
      product_deletedAt: Date.now(),
      product_isPublished: false,
      product_isDraft: true,
    })
    .lean();
  if (!result) throw new InternalServerError('Delete product fail!');

  return result;
};

const validateCheckoutProducts = async (
  shopId: string,
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[]
) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductDetails(product.productId, shopId);
      if (!foundProduct) {
        throw new BadRequestError('Product not found');
      }

      return {
        ...product,
        price: foundProduct.product_price!,
      };
    })
  );
};

const queryProduct = async (
  filter: IProductFilter,
  { select, limit = 50, page = 1 }: IProductOption
) => {
  return await ProductModel.find<IProduct>(
    formatAttributeName(filter, PRODUCT.PREFIX)
  )
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .select(select || {})
    .skip(getSkipNumber(+limit || 50, +page || 1))
    .limit(+limit || 50)
    .lean();
};

const findProduct = async (query: Object, isDeleted = false) => {
  return await ProductModel.findOne({
    ...formatAttributeName(query, PRODUCT.PREFIX),
    product_deletedAt: { [isDeleted ? '$ne' : '$eq']: null },
  })
    .populate('product_shop', 'name email -_id')
    .select('-__v -updatedAt -createdAt');
};

export {
  findProduct,
  deleteProduct,
  getAllProducts,
  restoreProduct,
  publishProduct,
  searchProducts,
  unpublishProduct,
  getProductDetails,
  getAllDeletedProducts,
  validateCheckoutProducts,
  getProductDetailsForShop,
};
