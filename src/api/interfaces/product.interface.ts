import { HydratedDocument, Model, ObjectId } from 'mongoose';

export interface IRawProduct {
  _id: string;
  name: string;
  thumb: string;
  description?: string;
  slug?: String;
  price: number;
  quantity: number;
  type: 'Electronic' | 'Clothing' | 'Furniture';
  shop: string | ObjectId;
  attributes: Omit<IRawClothing | IRawElectronic | IRawFurniture, 'shop'>;
  ratingsAverage: Number;
  variations: string[];
  isDraft: boolean;
  isPublished: boolean;
  deletedAt?: Date;
}

export interface IRawClothing {
  _id: string;
  brand: string;
  size: String;
  material: String;
  shop: string | ObjectId;
  deletedAt?: Date;
}

export interface IRawElectronic {
  _id: string;
  manufacturer: string;
  model: String;
  color: String;
  shop: string | ObjectId;
  deletedAt?: Date;
}

export interface IRawFurniture {
  brand: string;
  size: String;
  material: String;
  shop: string | ObjectId;
  deletedAt?: Date;
}

export type IProduct = HydratedDocument<IRawProduct>;
export type IClothing = HydratedDocument<IRawClothing>;
export type IFurniture = HydratedDocument<IRawFurniture>;
export type IElectronic = HydratedDocument<IRawElectronic>;

export interface IProductAttrs
  extends Omit<
    IRawProduct,
    '_id' | 'ratingsAverage' | 'slug' | 'isDraft' | 'isPublished' | 'deletedAt'
  > {
  _id?: string;
}
// export interface IProductAttrs {
//   _id?: string;
//   name: string;
//   price: number;
//   quantity: number;
//   type: 'Electronic' | 'Clothing' | 'Furniture';
//   shop: string | ObjectId;
//   isDraft: boolean;
//   isPublished: boolean;
// }

export interface IProductModel extends Model<IProduct> {
  build(attrs: IProductAttrs): Promise<IProduct>;
}
