import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * BadRequest class
 * @class BadRequest
 */
export default class BadRequest extends HttpException {
  /**
   * Constructor
   *
   * @param message
   */
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
