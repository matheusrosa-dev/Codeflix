import {
	ClassSerializerInterceptor,
	INestApplication,
	ValidationPipe,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WrapperDataInterceptor } from "./shared/interceptors/wrapper-data/wrapper-data.interceptor";
import { EntityValidationErrorFilter } from "./shared/filters/entity-validation-error.filter";
import { NotFoundErrorFilter } from "./shared/filters/not-found-error.filter";

export function applyGlobalConfig(app: INestApplication) {
	app.useGlobalPipes(
		new ValidationPipe({
			errorHttpStatusCode: 422,
			transform: true,
		}),
	);
	app.useGlobalInterceptors(
		new WrapperDataInterceptor(),
		new ClassSerializerInterceptor(app.get(Reflector)),
	);
	app.useGlobalFilters(
		new EntityValidationErrorFilter(),
		new NotFoundErrorFilter(),
	);
}
