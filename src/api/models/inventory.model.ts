import { Schema, Types, model } from 'mongoose';

import { INVENTORY } from '../constants/inventory.constant';
import { IInventory, IInventoryAttrs, IInventoryModel } from '../interfaces/inventory.interface';

const inventorySchema = new Schema<IInventory, IInventoryModel>(
  {
    productId: { type: Types.ObjectId, required: true },
    shopId: { type: Types.ObjectId, required: true },
    stock: {
      type: Number,
      require: true,
      min: [0, 'Stock must be positive'],
      set: (val: number) => Math.floor(val),
    },
    location: { type: String, default: 'unknow' },
    reservations: { type: [Object], default: [] },
  },
  {
    timestamps: true,
    collection: INVENTORY.COLLECTION_NAME,
  }
);

inventorySchema.statics.build = async (attrs: IInventoryAttrs) => {
  return InventoryModel.create(attrs);
};

export const InventoryModel = model<IInventory, IInventoryModel>(
  INVENTORY.DOCUMENT_NAME,
  inventorySchema
);
