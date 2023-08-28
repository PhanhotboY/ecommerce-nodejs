import { ErrorBase } from '../bases/error.base';
import { statusCodes, reasonPhrases } from '../httpStatusCodes';

export class NotFoundError extends ErrorBase {
  status = statusCodes.NOT_FOUND;
  isOperation = false;

  constructor(public message = reasonPhrases.NOT_FOUND) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
