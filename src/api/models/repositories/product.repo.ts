import { Types } from 'mongoose';
import { ProductModel } from '../product.model';
import { BadRequestError, InternalServerError } from '../../core/errors';
import { IProductAttrs } from '../../interfaces/product.interface';
import { removeNestedNullish } from '../../utils';

interface IProductQuery {
  shop: string;
  isDraft?: boolean;
  isPublished?: boolean;
}

interface IProductOption {
  limit: string | number;
  skip: string | number;
}

const getAllDraftProducts = async (query: IProductQuery, options: IProductOption) => {
  return await queryProduct({ ...query, isDraft: true, isPublished: false }, options);
};

const getAllProducts = async (query: IProductQuery, options: IProductOption) => {
  return await queryProduct({ ...query, isPublished: true, isDraft: false }, options);
};

const unpublishProduct = async (shop: string, productId: string) => {
  const foundProduct = await ProductModel.findOne({
    shop: new Types.ObjectId(shop),
    _id: new Types.ObjectId(productId),
  });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct.updateOne({ isDraft: true, isPublished: false });
  if (!result) throw new InternalServerError('Cannot unpublish product!');

  return result;
};

const publishProduct = async (shop: string, productId: string) => {
  const foundProduct = await ProductModel.findOne({
    shop: new Types.ObjectId(shop),
    _id: new Types.ObjectId(productId),
  });
  if (!foundProduct) throw new BadRequestError('Product does not exist!');

  const result = await foundProduct.updateOne({ isDraft: false, isPublished: true });
  if (!result) throw new InternalServerError('Cannot unpublish product!');

  return result;
};

const searchProducts = async (search: string) => {
  const result = await ProductModel.find(
    {
      $text: { $search: search },
    },
    { score: { $meta: 'textScore' } }
  ).lean();

  return result;
};

const updateProduct = async (shop: string, productId: string, payload: IProductAttrs) => {
  const update = removeNestedNullish(payload);

  const result = await ProductModel.findOneAndUpdate(
    { shop, _id: new Types.ObjectId(productId) },
    update,
    {
      new: true,
    }
  ).lean();

  return result;
};

const queryProduct = async (query: IProductQuery, options: IProductOption) => {
  return await ProductModel.find(query)
    .populate('shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(Number(options.skip))
    .limit(Number(options.limit))
    .lean()
    .exec();
};

export {
  getAllDraftProducts,
  getAllProducts,
  unpublishProduct,
  publishProduct,
  searchProducts,
  updateProduct,
};
