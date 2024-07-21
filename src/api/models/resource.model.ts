import { Schema, model } from 'mongoose';
import {
  IRawResource,
  IResource,
  IResourceModel,
} from '../interfaces/resource.interface';
import { RESOURCE } from '../constants/resource.constant';
import { formatAttributeName } from '../utils';

const ResourceSchema = new Schema<IResource, IResourceModel>(
  {
    src_name: { type: String, required: true, unique: true },
    src_slug: { type: String, required: true, unique: true },
    src_description: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: RESOURCE.COLLECTION_NAME,
  }
);

ResourceSchema.statics.build = (attrs: IRawResource): Promise<IResource> => {
  return ResourceModel.create(formatAttributeName(attrs, RESOURCE.PREFIX));
};

export const ResourceModel = model<IResource, IResourceModel>(
  RESOURCE.DOCUMENT_NAME,
  ResourceSchema
);
