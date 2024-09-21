import { IApiKey } from '../interfaces/apiKey.interface';

declare global {
  type Values<T> = T[keyof T];

  namespace Express {
    export interface Request {
      objKey: IApiKey;
      requestId?: string;
    }
  }
}

export {};
