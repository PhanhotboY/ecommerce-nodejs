import { Schema, Types, model } from 'mongoose';
import { IRole, IRoleModel } from '../interfaces/role.interface';
import { RESOURCE, ROLE } from '../constants';

const RoleSchema = new Schema<IRole, IRoleModel>(
  {
    rol_name: { type: String, required: true },
    rol_slug: { type: String, required: true },
    rol_status: { type: String, required: true },
    rol_description: { type: String, required: true },
    rol_grants: [
      {
        resource: {
          type: Types.ObjectId,
          required: true,
          ref: RESOURCE.DOCUMENT_NAME,
        },
        actions: { type: String, required: true },
        attributes: { type: String, default: '*' },
      },
    ],
  },
  {
    timestamps: true,
    collection: ROLE.COLLECTION_NAME,
  }
);

RoleSchema.statics.build = (attrs: IRole): Promise<IRole> => {
  return RoleModel.create(attrs);
};

export const RoleModel = model<IRole, IRoleModel>(
  ROLE.DOCUMENT_NAME,
  RoleSchema
);
