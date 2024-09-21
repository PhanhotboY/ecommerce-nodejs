import { model, Schema } from 'mongoose';
import { PRODUCT } from '../constants';
import { formatAttributeName } from '@utils/index';
import { ISPU, ISPUAttrs, ISPUModel } from '../interfaces/spu.interface';

const spuSchema = new Schema<ISPU, ISPUModel>(
  {
    spu_name: { type: String, required: true, trim: true, maxLength: 150 },
    spu_thumb: { type: String, required: true, trim: true },
    spu_slug: { type: String, required: true },
    spu_description: { type: String, required: true },
    spu_price: { type: Number, required: true },
    spu_quantity: { type: Number, required: true },
    spu_attributes: { type: Schema.Types.Mixed, required: true },
    spu_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    spu_variations: { type: [String], default: [] },
    spu_isDraft: { type: Boolean, default: true, index: true, select: false },
    spu_isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    spu_deletedAt: { type: Date, default: null, index: true, select: false },
  },
  { timestamps: true, collection: PRODUCT.SPU.COLLECTION_NAME }
);

spuSchema.index({ spu_name: 1, spu_slug: 1 }, { unique: true });

spuSchema.statics.build = (attrs: ISPUAttrs) => {
  return SpuModel.create(formatAttributeName(attrs, PRODUCT.SPU.PREFIX));
};

export const SpuModel = model(PRODUCT.SPU.COLLECTION_NAME, spuSchema);
