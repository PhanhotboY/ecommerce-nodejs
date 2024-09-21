import { ErrorBase } from './error.abstract';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

export class ForbiddenError extends ErrorBase {
  status = statusCodes.FORBIDDEN;
  isOperation = false;

  constructor(public message = reasonPhrases.FORBIDDEN) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
