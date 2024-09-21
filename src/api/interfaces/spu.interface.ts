import { HydratedDocument, Model } from 'mongoose';

interface IRawSPU {
  spu_name: string;
  spu_thumb: string;
  spu_slug: string;
  spu_description: string;
  spu_price: number;
  spu_quantity: number;
  spu_attributes: Object;
  spu_ratingsAverage: number;
  spu_variations: string[];
  spu_isDraft: boolean;
  spu_isPublished: boolean;
  spu_deletedAt: Date;
}

export type ISPU = HydratedDocument<IRawSPU>;

export interface ISPUAttrs {
  name: string;
  thumb: string;
  slug: string;
  description: string;
  price: number;
  quantity: number;
  attributes: Object;
  ratingsAverage: number;
  variations: string[];
  isDraft?: Date;
  isPublished?: Date;
  deletedAt?: Date;
}

export interface ISPUModel extends Model<ISPU> {
  build(attrs: ISPUAttrs): Promise<ISPU>;
}
