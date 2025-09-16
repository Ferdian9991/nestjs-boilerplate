import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Validation class
 * @class Validation
 */
export default class Validation extends HttpException {
  /**
   * Constructor
   *
   * @param message
   */
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
