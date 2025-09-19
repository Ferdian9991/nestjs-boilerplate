import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationErrorType } from './response.helper';
import Validation from '../error/validation.error';

/**
 * Validation helper class
 * @class Validation
 */
export default class ValidationHelper {
  /**
   * Get validation pipe
   * @returns {ValidationPipe}
   */
  public static getValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      transform: false,
      exceptionFactory: ValidationHelper.getExceptionFactory,
    });
  }

  /**
   * Get exception factory
   *
   * @param {ValidationError[]} validationErrors
   * @returns {string}
   */
  public static getExceptionFactory(
    validationErrors: ValidationError[],
  ): Validation {
    // check if validationErrors is string
    if (typeof validationErrors === 'string') {
      return new Validation(
        JSON.stringify([{ field: 'none', message: validationErrors }]),
      );
    }

    const errors: ValidationErrorType[] = validationErrors.map((error) => {
      return {
        index:
          (
            error.target as {
              index?: number;
            }
          ).index ?? undefined,
        field: error.property,
        message: Object.values(error.constraints)[0],
      };
    });

    return new Validation(JSON.stringify(errors));
  }
}
