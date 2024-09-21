import { randomBytes } from 'crypto';
import { OTPModel } from '../models/otp.model';

const newOTP = async (email: string) => {
  await OTPModel.deleteMany({ otp_email: email });

  const token = randomBytes(16).toString('hex');

  return await OTPModel.build({ token, email });
};

const getOTPByEmail = async (email: string) => {
  return await OTPModel.findOne({ otp_email: email });
};

const deleteOTPByEmail = async (email: string) => {
  return await OTPModel.deleteMany({ otp_email: email });
};

const getOTPByToken = async (token: string) => {
  return await OTPModel.findOne({ otp_token: token });
};

export { newOTP, getOTPByEmail, deleteOTPByEmail, getOTPByToken };
