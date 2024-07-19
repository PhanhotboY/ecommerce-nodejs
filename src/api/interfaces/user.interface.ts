import { HydratedDocument, Model, Types } from 'mongoose';
import { USER } from '../constants';

export interface IRawUser {
  usr_id: Types.ObjectId | string;
  usr_role: Types.ObjectId | string;
  usr_slug: string;
  usr_name: string;
  usr_email: string;
  usr_password: string;
  usr_salt: string;
  usr_phone: string;
  usr_sex: string;
  usr_avatar: string;
  usr_birthdate: Date;
  usr_status: Values<typeof USER.STATUS>;
}

export interface IUser extends HydratedDocument<IRawUser> {}

export interface IUserAttrs {
  id: string;
  role?: string;
  slug: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  sex: string;
  avatar?: string;
  birthdate?: Date;
}

export interface IUserModel extends Model<IUser> {
  build(attrs: IUserAttrs): Promise<IUser>;
}
