import { Types } from 'mongoose';
import { ProductModel } from '../product.model';
import { BadRequestError, InternalServerError } from '../../core/errors';
import { IProduct } from '../../interfaces/product.interface';

interface IProductFilter {
  shop?: string;
  isDraft?: boolean;
  isPublished?: boolean;
  deletedAt?: Date | null | Object;
  _id?: string | { $in: string[] };
}

interface IProductOption {
  limit: string | number;
  skip: string | number;
  select?: string;
}

const getAllDraftProducts = async (filter: IProductFilter, options: IProductOption) => {
  return await queryProduct(
    { ...filter, isDraft: true, isPublished: false, deletedAt: null },
    { ...options, select: 'name thumb price ratingsAverage slug' }
  );
};

const getAllProducts = async (filter: IProductFilter, options: IProductOption) => {
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

const getProductDetails = async (productId: string, shop?: string) => {
  const query = {
    _id: productId,
    ...(shop ? { shop } : { isPublished: true, deletedAt: null }),
  };

  return await ProductModel.findOne(query)
    .populate('shop', 'name email -_id')
    .select(shop ? '-__v' : '-__v -updatedAt -createdAt')
    .lean();
};

const unpublishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct(shop, productId);

  const result = await foundProduct.updateOne({ isDraft: true, isPublished: false });
  if (!result) throw new InternalServerError('Cannot unpublish product!');

  return result;
};

const publishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct(shop, productId);

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
  const deletedProduct = await findProduct(shop, productId, true);

  const result = await deletedProduct.updateOne({ deletedAt: null });
  if (!result) throw new InternalServerError('Restore product fail!');

  return result;
};

const deleteProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct(shop, productId);

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

const queryProduct = async (filter: IProductFilter, options: IProductOption) => {
  return await ProductModel.find<IProduct>(filter)
    .populate('shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .select(options.select || {})
    .skip(Number(options.skip))
    .limit(Number(options.limit))
    .lean();
};

const findProduct = async (shop: string, productId: string, isDeleted = false) => {
  const foundProduct = await ProductModel.findOne({
    shop: new Types.ObjectId(shop),
    _id: new Types.ObjectId(productId),
    deletedAt: { [isDeleted ? '$ne' : '$eq']: null },
  });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  return foundProduct;
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
};
