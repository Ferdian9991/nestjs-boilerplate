import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * NotFound class
 * @class NotFound
 */
export default class NotFound extends HttpException {
  /**
   * Constructor
   *
   * @param message
   */
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
