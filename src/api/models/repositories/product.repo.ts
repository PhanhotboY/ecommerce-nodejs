import { Types } from 'mongoose';
import { ProductModel } from '../product.model';
import { BadRequestError, InternalServerError } from '../../core/errors';
import { IProduct } from '../../interfaces/product.interface';
import { getSkipNumber, isEmptyObj } from '../../utils';

interface IProductFilter {
  shop?: string;
  isDraft?: boolean;
  isPublished?: boolean;
  deletedAt?: Date | null | Object;
  _id?: string | { $in: Array<any> };
}

interface IProductOption {
  limit?: string | number;
  page?: string | number;
  select?: string;
}

const getAllDraftProducts = async (filter: IProductFilter, options: IProductOption) => {
  return await queryProduct(
    { ...filter, isDraft: true, isPublished: false, deletedAt: null },
    { ...options, select: 'name thumb price ratingsAverage slug' }
  );
};

const getAllProducts = async (filter: IProductFilter, options?: IProductOption) => {
  return await queryProduct(
    { ...filter, isPublished: true, isDraft: false, deletedAt: null },
    { ...options, select: 'name thumb price ratingsAverage slug' }
  );
};

const getAllDeletedProducts = async (filter: IProductFilter, options: IProductOption) => {
  return await queryProduct(
    { ...filter, isPublished: false, isDraft: true, deletedAt: { $ne: null } },
    {
      ...options,
      select: 'name thumb price ratingsAverage slug deletedAt',
    }
  );
};

const getProductDetails = async (productId: string, shopId?: string) => {
  const result = await findProduct({
    _id: new Types.ObjectId(productId),
    ...(shopId ? { shop: new Types.ObjectId(shopId) } : {}),
    isPublished: true,
    isDraft: false,
  });

  return (result || {}) as NonNullable<typeof result>;
};

const getProductDetailsForShop = async (productId: string, shopId: string) => {
  const result = await findProduct({
    _id: new Types.ObjectId(productId),
    shop: new Types.ObjectId(shopId),
  });

  return (result || {}) as NonNullable<typeof result>;
};

const unpublishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({ shop, _id: productId });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct.updateOne({ isDraft: true, isPublished: false });
  if (!result) throw new InternalServerError('Cannot unpublish product!');

  return result;
};

const publishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({ shop, _id: productId });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct.updateOne({ isDraft: false, isPublished: true });
  if (!result) throw new InternalServerError('Cannot unpublish product!');

  return result;
};

const searchProducts = async (search: string) => {
  const result = await ProductModel.find(
    { $text: { $search: search }, isDeleted: null, isPublished: true },
    { score: { $meta: 'textScore' } }
  )
    .select('name thumb slug price ratingsAverage')
    .lean();

  return result;
};

const restoreProduct = async (shop: string, productId: string) => {
  const deletedProduct = await findProduct({ shop, _id: productId }, true);
  if (!deletedProduct) throw new BadRequestError('Product does not exist!');

  const result = await deletedProduct.updateOne({ deletedAt: null });
  if (!result) throw new InternalServerError('Restore product fail!');

  return result;
};

const deleteProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({ shop, _id: productId });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct
    .updateOne({
      deletedAt: Date.now(),
      isPublished: false,
      isDraft: true,
    })
    .lean();
  if (!result) throw new InternalServerError('Delete product fail!');

  return result;
};

const validateChecoutProducts = async (
  shopId: string,
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[]
) => {
  return Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductDetails(product.productId, shopId);

      if (!isEmptyObj(foundProduct)) {
        return {
          ...product,
          price: foundProduct.price,
        };
      }
    })
  );
};

const queryProduct = async (
  filter: IProductFilter,
  { select, limit = 50, page = 1 }: IProductOption
) => {
  return await ProductModel.find<IProduct>(filter)
    .populate('shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .select(select || {})
    .skip(getSkipNumber(+limit || 50, +page || 1))
    .limit(+limit || 50)
    .lean();
};

const findProduct = async (query: Object, isDeleted = false) => {
  return await ProductModel.findOne({
    ...query,
    deletedAt: { [isDeleted ? '$ne' : '$eq']: null },
  })
    .populate('shop', 'name email -_id')
    .select('-__v -updatedAt -createdAt')
    .lean();
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
  getAllDraftProducts,
  getAllDeletedProducts,
  validateChecoutProducts,
  getProductDetailsForShop,
};
