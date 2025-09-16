import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * ConflictError class
 * @class ConflictError
 */
export default class ConflictError extends HttpException {
  /**
   * Constructor
   *
   * @param message
   */
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
