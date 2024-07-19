import { model, Schema } from 'mongoose';

import { ROLE, USER } from '../constants';
import { IUserAttrs, IUser, IUserModel } from '../interfaces/user.interface';
import _ from 'lodash';
import { formatAttributeName } from '../utils';

const userSchema = new Schema<IUser, IUserModel>(
  {
    usr_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    usr_email: { type: String, required: true, unique: true },
    usr_name: { type: String, required: true },
    usr_password: { type: String, required: true },
    usr_salt: { type: String, require: true },
    usr_avatar: { type: String, default: '' },
    usr_birthdate: { type: Date, default: null },
    usr_phone: { type: String, default: '' },
    usr_role: { type: Schema.Types.ObjectId, ref: ROLE.DOCUMENT_NAME },
    usr_sex: { type: String, default: '' },
    usr_status: {
      type: String,
      default: USER.STATUS.PENDING,
      enum: [...Object.values(USER.STATUS)],
    },
  },
  {
    timestamps: true,
    collection: USER.COLLECTION_NAME,
  }
);

userSchema.statics.build = async (attrs: IUserAttrs) => {
  return UserModel.create(formatAttributeName(attrs, USER.PREFIX));
};

export const UserModel = model<IUser, IUserModel>(
  USER.DOCUMENT_NAME,
  userSchema
);
