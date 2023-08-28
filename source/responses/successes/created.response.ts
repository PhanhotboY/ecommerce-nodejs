import { SuccessBase } from '../bases/success.base';
import { ISuccessFunc } from '../interfaces';
import { reasonPhrases, statusCodes } from '../httpStatusCodes';

class CreatedResponse extends SuccessBase {
  readonly status = statusCodes.CREATED;

  constructor(
    readonly message: string = reasonPhrases.CREATED,
    readonly metadata: Object = {},
    readonly options: Object = {},
    readonly link: Object = {}
  ) {
    super();
  }
}

export const CREATED: ISuccessFunc = ({ res, message, metadata, options, link }) => {
  new CreatedResponse(message, metadata, options, link).send(res);
};
