import { ErrorBase } from './error.abstract';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

export class UnauthorizedError extends ErrorBase {
  status = statusCodes.UNAUTHORIZED;
  isOperation = false;

  constructor(public message = reasonPhrases.UNAUTHORIZED) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
