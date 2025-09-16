import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Forbidden class
 * @class Forbidden
 */
export default class Forbidden extends HttpException {
  /**
   * Constructor
   *
   * @param message
   */
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
