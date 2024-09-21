import { Schema, model } from 'mongoose';

import { ITemplate, ITemplateModel } from '../interfaces/template.interface';
import { TEMPLATE } from '../constants';
import { formatAttributeName } from '@utils/index';

const templateSchema = new Schema<ITemplate>(
  {
    tem_name: {
      type: String,
      required: true,
      unique: true,
    },
    tem_html: {
      type: String,
      required: true,
    },
    tem_status: {
      type: String,
      enum: Object.values(TEMPLATE.STATUS),
      default: TEMPLATE.STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: TEMPLATE.COLLECTION_NAME,
  }
);

templateSchema.statics.build = async (attrs: ITemplate): Promise<ITemplate> => {
  return await TemplateModel.create(
    formatAttributeName(attrs, TEMPLATE.PREFIX)
  );
};

export const TemplateModel = model<ITemplate, ITemplateModel>(
  TEMPLATE.COLLECTION_NAME,
  templateSchema
);
