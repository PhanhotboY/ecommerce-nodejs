import { Schema, Types, model } from 'mongoose';
import { IRole, IRoleModel } from '../interfaces/role.interface';
import { RESOURCE, ROLE } from '../constants';
import { formatAttributeName } from '../utils';

const RoleSchema = new Schema<IRole, IRoleModel>(
  {
    rol_name: { type: String, required: true, unique: true },
    rol_slug: { type: String, required: true, unique: true },
    rol_status: { type: String, required: true },
    rol_description: { type: String, required: true },
    rol_grants: [
      {
        resource: {
          type: Types.ObjectId,
          required: true,
          ref: RESOURCE.DOCUMENT_NAME,
        },
        action: { type: Array<String>, required: true },
        attributes: { type: String, default: '*' },
      },
    ],
  },
  {
    timestamps: true,
    collection: ROLE.COLLECTION_NAME,
  }
);

RoleSchema.statics.build = (attrs: IRole) => {
  return RoleModel.create(formatAttributeName(attrs, ROLE.PREFIX));
};

export const RoleModel = model<IRole, IRoleModel>(
  ROLE.DOCUMENT_NAME,
  RoleSchema
);
