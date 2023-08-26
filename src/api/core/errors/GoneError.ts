import { ErrorBase } from './error.abstract';
import { statusCodes, reasonPhrases } from '../httpStatusCode';

export class GoneError extends ErrorBase {
  status = statusCodes.GONE;
  isOperation = false;

  constructor(public message = reasonPhrases.GONE) {
    super(message);

    Object.setPrototypeOf(this, GoneError.prototype);
  }
}
