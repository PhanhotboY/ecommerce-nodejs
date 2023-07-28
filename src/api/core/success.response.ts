import { Response } from 'express';

import { reasonPhrases, statusCodes } from './httpStatusCode';

class SuccessBase {
  constructor(
    public message = reasonPhrases.OK,
    public status = statusCodes.OK,
    public metadata = {},
    public options = {}
  ) {}

  send(res: Response) {
    res.status(this.status).json({
      message: this.message,
      metadata: this.metadata,
      options: this.options,
    });
  }
}

export const OK = (res: Response, message: string, metadata = {}, options = {}) => {
  new SuccessBase(message, statusCodes.OK, metadata, options).send(res);
};

export const CREATED = (res: Response, message: string, metadata = {}, options = {}) => {
  new SuccessBase(message, statusCodes.CREATED, metadata, options).send(res);
};
