import { ErrorBase } from '../bases/error.base';
import { statusCodes, reasonPhrases } from '../httpStatusCodes';

export class GoneError extends ErrorBase {
  status = statusCodes.GONE;
  isOperation = false;

  constructor(public message = reasonPhrases.GONE) {
    super(message);

    Object.setPrototypeOf(this, GoneError.prototype);
  }
}
