import bcrypt from 'bcrypt';

import { IUserAttrs } from '../interfaces/user.interface';
import { createUser } from '../models/repositories/user.repo';
import { UserModel } from '../models/user.model';
import { sendVerificationEmail } from './email.service';
import { deleteOTPByEmail, getOTPByToken } from './otp.service';
import { BadRequestError, InternalServerError } from '../core/errors';
import { createTokenPair, generateKeyPair } from '../auth/authUtils';
import { createKeyToken } from './keyToken.service';
import { getReturnData } from '@utils/index';

const newUser = async (user: IUserAttrs) => {
  const foundUser = await UserModel.findOne({ usr_email: user.email });
  if (foundUser) {
    throw new Error('User already exists');
  }

  return await sendVerificationEmail(user.email);
};

const verifyEmailToken = async ({ token }: { token: string }) => {
  if (!token) {
    throw new BadRequestError('Invalid token');
  }

  const foundOtp = await getOTPByToken(token);
  if (!foundOtp) {
    throw new BadRequestError('Invalid token');
  }
  const { otp_email: email } = foundOtp;
  await deleteOTPByEmail(email);

  const foundUser = await UserModel.findOne({ usr_email: email });
  if (foundUser) {
    throw new BadRequestError('Email already exists');
  }

  const hashPassword = await bcrypt.hash(email, 10);

  const newUser = await createUser({
    email,
    password: hashPassword,
    name: email,
    slug: email.split('@')[0],
  });

  if (!newUser) {
    throw new InternalServerError('Fail to create new shop!');
  }

  const { privateKey, publicKey } = generateKeyPair();

  const tokens = createTokenPair({
    payload: { userId: newUser.id, email },
    privateKey,
    publicKey,
  });

  await createKeyToken({
    user: newUser.id,
    privateKey,
    publicKey,
    refreshToken: tokens.refreshToken,
  });

  return {
    shop: getReturnData(newUser, { without: ['usr_password', 'usr_status'] }),
    tokens,
  };
};

export { newUser, verifyEmailToken };
