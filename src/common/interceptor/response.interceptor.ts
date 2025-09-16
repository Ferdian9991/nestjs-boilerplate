import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import ResponseHelper, { ResponseTypes } from '../helper/response.helper';
import { IGNORE_RESPONSE_KEY } from '../decorator/ignore-response.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseTypes<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseTypes<T>> {
    const message = this.reflector.get<string>(
      'response_message',
      context.getHandler(),
    );

    const isIgnored = this.reflector.get<boolean>(
      IGNORE_RESPONSE_KEY,
      context.getHandler(),
    );
    if (isIgnored) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(
        map((data) =>
          new ResponseHelper<T>(
            message || '',
            context.switchToHttp().getResponse().statusCode,
            data,
          ).success(),
        ),
      );
  }
}
