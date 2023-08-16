import slugify from 'slugify';
import { Schema, model } from 'mongoose';

import { PRODUCT } from '../constants';
import {
  IClothing,
  IElectronic,
  IFurniture,
  IProduct,
  IProductModel,
} from '../interfaces/product.interface';
import { IShopAttrs } from '../interfaces/shop.interface';

const productSchema = new Schema<IProduct, IProductModel>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    thumb: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    slug: String,
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    // more
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    variations: {
      type: [String],
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false, // Unselectable field
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false, // Unselectable field
    },
    deletedAt: {
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
    brand: { type: String, required: true },
    size: String,
    material: String,
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    deletedAt: {
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
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    collection: PRODUCT.COLLECTION_ELECTRON_NAME,
    timestamps: true,
  }
);

const furnitureSchema = new Schema<IFurniture, IProductModel>(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    deletedAt: {
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
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.statics.build = async (attrs: IShopAttrs) => {
  return ProductModel.create(attrs);
};

const ProductModel = model<IProduct, IProductModel>(PRODUCT.DOCUMENT_NAME, productSchema);
const ClothingModel = model<IProduct, IProductModel>(
  PRODUCT.DOCUMENT_CLOTHING_NAME,
  clothingSchema
);
const FurnitureModel = model<IProduct, IProductModel>(
  PRODUCT.DOCUMENT_FURNITURE_NAME,
  furnitureSchema
);
const ElectronicModel = model<IProduct, IProductModel>(
  PRODUCT.DOCUMENT_ELECTRON_NAME,
  electronicSchema
);

export { ProductModel, ClothingModel, FurnitureModel, ElectronicModel };
