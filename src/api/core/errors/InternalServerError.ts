import { ErrorBase } from './error.abstract';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

export class InternalServerError extends ErrorBase {
  status = statusCodes.INTERNAL_SERVER_ERROR;
  isOperation = false;

  constructor(public message = reasonPhrases.INTERNAL_SERVER_ERROR) {
    super(message);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
