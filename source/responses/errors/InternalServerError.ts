import { ErrorBase } from '../bases/error.base';
import { statusCodes, reasonPhrases } from '../httpStatusCodes';

export class InternalServerError extends ErrorBase {
  status = statusCodes.INTERNAL_SERVER_ERROR;
  isOperation = false;

  constructor(public message = reasonPhrases.INTERNAL_SERVER_ERROR) {
    super(message);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
