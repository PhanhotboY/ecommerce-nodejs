import { HydratedDocument, Model, ObjectId } from 'mongoose';

export interface IRawProduct {
  _id: string;
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_slug?: string;
  product_price: number;
  product_quantity: number;
  product_type: 'Electronic' | 'Clothing' | 'Furniture';
  product_shop: string | ObjectId;
  product_attributes: Omit<
    IRawClothing | IRawElectronic | IRawFurniture,
    'shop'
  >;
  product_ratingsAverage: Number;
  product_variations: string[];
  product_isDraft: boolean;
  product_isPublished: boolean;
  product_deletedAt?: Date | null;
}

export interface IRawClothing {
  _id: string;
  product_brand: string;
  product_size: string;
  product_material: string;
  product_shop: string | ObjectId;
  product_deletedAt?: Date;
}

export interface IRawElectronic {
  _id: string;
  product_manufacturer: string;
  product_model: string;
  product_color: string;
  product_shop: string | ObjectId;
  product_deletedAt?: Date;
}

export interface IRawFurniture {
  _id: string;
  product_brand: string;
  product_size: string;
  product_material: string;
  product_shop: string | ObjectId;
  product_deletedAt?: Date;
}

export type IProduct = HydratedDocument<IRawProduct>;
export type IClothing = HydratedDocument<IRawClothing>;
export type IFurniture = HydratedDocument<IRawFurniture>;
export type IElectronic = HydratedDocument<IRawElectronic>;

export interface IProductAttrs {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  type: 'Electronic' | 'Clothing' | 'Furniture';
  shop: string | ObjectId;
  attributes: Omit<IRawClothing | IRawElectronic | IRawFurniture, 'shop'>;
  isDraft?: boolean;
  isPublished?: boolean;
}

export interface IProductModel extends Model<IProduct> {
  build(attrs: IProductAttrs): Promise<IProduct>;
}
