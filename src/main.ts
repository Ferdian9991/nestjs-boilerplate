import { NestFactory, Reflector } from '@nestjs/core';
import { DefaultModule } from './default.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import ValidationHelper from './common/helper/validation.helper';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(DefaultModule);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(ValidationHelper.getValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
