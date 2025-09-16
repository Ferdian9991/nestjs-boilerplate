import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Unauthorized class
 * @class Unauthorized
 */
export default class Unauthorized extends HttpException {
  /**
   * Constructor
   *
   * @param message
   */
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
