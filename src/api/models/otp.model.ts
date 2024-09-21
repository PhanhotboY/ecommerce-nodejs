import { Schema, model } from 'mongoose';

import { IOTP, IOTPAttrs, IOTPModel } from '../interfaces/otp.interface';
import { OTP } from '../constants';
import { formatAttributeName } from '@utils/index';

const otpSchema = new Schema<IOTP>(
  {
    otp_token: {
      type: String,
      required: true,
    },
    otp_email: {
      type: String,
      required: true,
    },
    otp_status: {
      type: String,
      enum: Object.values(OTP.STATUS),
      default: OTP.STATUS.ACTIVE,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
  },
  {
    timestamps: true,
    collection: OTP.COLLECTION_NAME,
  }
);

otpSchema.statics.build = async (attrs: IOTPAttrs): Promise<IOTP> => {
  return OTPModel.create(formatAttributeName(attrs, OTP.PREFIX));
};

export const OTPModel = model<IOTP, IOTPModel>(OTP.COLLECTION_NAME, otpSchema);
