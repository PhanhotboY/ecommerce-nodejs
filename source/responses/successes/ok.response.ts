import { SuccessBase } from '../bases/success.base';
import { ISuccessFunc } from '../interfaces';
import { reasonPhrases, statusCodes } from '../httpStatusCodes';

class OkResponse extends SuccessBase {
  readonly status = statusCodes.OK;

  constructor(
    readonly message: string = reasonPhrases.OK,
    readonly metadata: Object = {},
    readonly options: Object = {},
    readonly link: Object = {}
  ) {
    super();
  }
}

export const OK: ISuccessFunc = ({ res, message, metadata, options, link }) => {
  new OkResponse(message, metadata, options, link).send(res);
};
