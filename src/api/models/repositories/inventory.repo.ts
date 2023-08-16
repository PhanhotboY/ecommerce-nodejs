import { InternalServerError } from '../../core/errors';
import { IInventoryAttrs } from '../../interfaces/inventory.interface';
import { InventoryModel } from '../inventory.model';

const insertInventory = async (attrs: IInventoryAttrs) => {
  const result = await InventoryModel.build(attrs);
  if (!result) throw new InternalServerError('Cannot insert to inventory!');

  return result;
};

export { insertInventory };
