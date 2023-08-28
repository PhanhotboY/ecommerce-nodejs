import { ErrorBase } from '../bases/error.base';
import { statusCodes, reasonPhrases } from '../httpStatusCodes';

export class ForbiddenError extends ErrorBase {
  status = statusCodes.FORBIDDEN;
  isOperation = false;

  constructor(public message = reasonPhrases.FORBIDDEN) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
