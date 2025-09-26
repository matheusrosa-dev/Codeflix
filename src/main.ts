import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { WrapperDataInterceptor } from "./nest-modules/shared/interceptors/wrapper-data/wrapper-data.interceptor";
import { NotFoundErrorFilter } from "./nest-modules/shared/filters/not-found/not-found-error.filter";
import { EntityValidationErrorFilter } from "./nest-modules/shared/filters/entity-validation-error/entity-validation-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new WrapperDataInterceptor());
  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter(),
  );

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
