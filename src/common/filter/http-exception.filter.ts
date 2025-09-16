import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message: string | object = exception.message;
    const errors = this.parseJsonMessage(message);

    if (!errors) {
      response.status(status).json({
        statusCode: status,
        message: message,
      });

      return;
    }

    response.status(status).json({
      statusCode: status,
      message: 'There are several errors.',
      errors: errors,
    });
  }

  protected parseJsonMessage(message: string | any): boolean | object {
    try {
      return JSON.parse(message);
    } catch {
      return false;
    }
  }
}
