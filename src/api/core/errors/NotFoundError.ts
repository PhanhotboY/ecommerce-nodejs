import { ErrorBase } from './error.abstract';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

export class NotFoundError extends ErrorBase {
  status = statusCodes.NOT_FOUND;
  isOperation = false;

  constructor(public message = reasonPhrases.NOT_FOUND) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
