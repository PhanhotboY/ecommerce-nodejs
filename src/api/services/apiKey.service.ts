import { ApiKeyModel } from '../models/apiKey.model';

const findActiveApiKey = async (key: string) => {
  const objKey = await ApiKeyModel.findOne({ key, status: true }).lean();

  return objKey;
};

export { findActiveApiKey };
