import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { OTP } from '../constants/otp.constant';

export interface IRawOTP {
  otp_token: string;
  otp_email: string;
  otp_status: Values<typeof OTP.STATUS>;
  expireAt: Date;
}

export type IOTP = HydratedDocument<IRawOTP>;

export interface IOTPAttrs {
  token: string;
  email: string;
}

export interface IOTPModel extends Model<IOTP> {
  build(attrs: IOTPAttrs): Promise<IOTP>;
}
