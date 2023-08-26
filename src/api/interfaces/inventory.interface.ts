import { HydratedDocument, Model, ObjectId } from 'mongoose';

export interface IReservation {
  userId: string | ObjectId;
  quantity: number;
  createdAt: Date;
}

export interface IRawInventory {
  _id: string | ObjectId;
  productId: string | ObjectId;
  shopId: string | ObjectId;
  location: string;
  stock: number;
  reservations: IReservation[];
}

export type IInventory = HydratedDocument<IRawInventory>;

export interface IInventoryAttrs extends Omit<IRawInventory, 'reservations' | '_id'> {}

export interface IInventoryModel extends Model<IInventory> {
  build(attrs: IInventoryAttrs): Promise<IInventory>;
}
