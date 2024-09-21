import { Response } from 'express';

export interface ISuccessAttrs {
  res: Response;
  message?: string;
  metadata?: Object;
  options?: Object;
  link?: Object;
}

export interface ISuccessReponse {
  message: string;
  metadata: Object;
  options: Object;
  _link: Object;
}

// interface ISuccessFunc {
//   (obj: ISuccessAttrs): void
// }
export type ISuccessFunc = (obj: ISuccessAttrs) => void;
