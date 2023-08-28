import { Response } from 'express';

import { ISuccessReponse } from '../interfaces/success.interface';

export abstract class SuccessBase {
  abstract status: number;
  abstract message: string;
  abstract metadata: Object;
  abstract options: Object;
  abstract link: Object;

  send(res: Response) {
    res.status(this.status).json({
      message: this.message,
      metadata: this.metadata,
      options: this.options,
      _link: this.link,
    } as ISuccessReponse);
  }
}
