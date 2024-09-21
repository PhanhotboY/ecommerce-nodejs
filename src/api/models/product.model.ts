import slugify from 'slugify';
import { Schema, model } from 'mongoose';

import { PRODUCT, SHOP } from '../constants';
import {
  IClothing,
  IElectronic,
  IFurniture,
  IProduct,
  IProductAttrs,
  IProductModel,
} from '../interfaces/product.interface';
import { IShopAttrs } from '../interfaces/shop.interface';
import { formatAttributeName } from '../utils';

const productSchema = new Schema<IProduct, IProductModel>(
  {
    product_name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    product_thumb: {
      type: String,
      trim: true,
    },
    product_description: {
      type: String,
    },
    product_slug: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    // more
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: [String],
      default: [],
    },
    product_isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false, // Unselectable field
    },
    product_isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false, // Unselectable field
    },
    product_deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: PRODUCT.COLLECTION_NAME,
  }
);

const clothingSchema = new Schema<IClothing, IProductModel>(
  {
    product_brand: { type: String, required: true },
    product_size: String,
    product_material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: SHOP.DOCUMENT_NAME,
    },
    product_deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    collection: PRODUCT.COLLECTION_CLOTHING_NAME,
    timestamps: true,
  }
);

const electronicSchema = new Schema<IElectronic, IProductModel>(
  {
    product_manufacturer: { type: String, required: true },
    product_model: String,
    product_color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: SHOP.DOCUMENT_NAME,
    },
    product_deletedAt: {
      type: Schema.Types.Date,
      default: null,
      select: false,
    },
  },
  {
    collection: PRODUCT.COLLECTION_ELECTRONIC_NAME,
    timestamps: true,
  }
);

const furnitureSchema = new Schema<IFurniture, IProductModel>(
  {
    product_brand: { type: String, required: true },
    product_size: String,
    product_material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: SHOP.DOCUMENT_NAME,
    },
    product_deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    collection: PRODUCT.COLLECTION_FURNITURE_NAME,
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

productSchema.index({
  name: 'text',
  description: 'text',
  'attributes.manufacturer': 'text',
  'attributes.brand': 'text',
  thumb: -1,
});

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

productSchema.statics.build = async (attrs: IProductAttrs) => {
  return ProductModel.create(formatAttributeName(attrs, PRODUCT.PREFIX));
};

const ProductModel = model<IProduct, IProductModel>(
  PRODUCT.DOCUMENT_NAME,
  productSchema
);
const ClothingModel = model<IClothing, IProductModel>(
  PRODUCT.DOCUMENT_CLOTHING_NAME,
  clothingSchema
);
const FurnitureModel = model<IFurniture, IProductModel>(
  PRODUCT.DOCUMENT_FURNITURE_NAME,
  furnitureSchema
);
const ElectronicModel = model<IElectronic, IProductModel>(
  PRODUCT.DOCUMENT_ELECTRONIC_NAME,
  electronicSchema
);

export { ProductModel, ClothingModel, FurnitureModel, ElectronicModel };
