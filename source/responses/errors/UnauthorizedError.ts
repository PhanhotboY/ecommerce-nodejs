import { ErrorBase } from '../bases/error.base';
import { statusCodes, reasonPhrases } from '../httpStatusCodes';

export class UnauthorizedError extends ErrorBase {
  status = statusCodes.UNAUTHORIZED;
  isOperation = false;

  constructor(public message = reasonPhrases.UNAUTHORIZED) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
