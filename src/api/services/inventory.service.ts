import { Types } from 'mongoose';
import { InventoryModel } from '../models/inventory.model';
import { InternalServerError } from '../core/errors';

const reserveInventory = async (userId: string, productId: string, quantity: number) => {
  const query = { productId: new Types.ObjectId(productId), stock: { $gte: quantity } };
  const update = {
    $inc: { stock: -quantity },
    $push: { reservations: { userId, quantity, createdAt: new Date() } },
  };
  const result = await InventoryModel.updateOne(query, update, { new: true }).lean();

  if (!result) throw new InternalServerError('Cannot reserve product!');

  return result;
};

export { reserveInventory };
