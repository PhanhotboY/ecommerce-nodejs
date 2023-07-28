import { ErrorBase } from './error.abstract';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

export class BadRequestError extends ErrorBase {
  status = statusCodes.BAD_REQUEST;
  isOperation = false;

  constructor(public message = reasonPhrases.BAD_REQUEST) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
