import { Module } from "@nestjs/common";
import {
	ConfigModuleOptions,
	ConfigModule as NestConfigModule,
} from "@nestjs/config";
import Joi from "joi";
import { join } from "node:path";

//@ts-expect-error - the type is correct
const joiJson = Joi.extend((joi) => {
	return {
		type: "object",
		base: joi.object(),
		coerce(value, _schema) {
			if (value[0] !== "{" && !/^\s*\{/.test(value)) {
				return;
			}

			try {
				return { value: JSON.parse(value) };
			} catch (err) {
				console.error(err);
			}
		},
	};
});

type DB_SCHEMA_TYPE = {
	DB_VENDOR: "mysql" | "sqlite";
	DB_HOST: string;
	DB_PORT: number;
	DB_USERNAME: string;
	DB_PASSWORD: string;
	DB_DATABASE: string;
	DB_LOGGING: boolean;
	DB_AUTO_LOAD_MODELS: boolean;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
	DB_VENDOR: Joi.string().required().valid("mysql", "sqlite"),
	DB_HOST: Joi.string().required(),
	DB_DATABASE: Joi.string().when("DB_VENDOR", {
		is: "mysql",
		then: Joi.required(),
	}),
	DB_USERNAME: Joi.string().when("DB_VENDOR", {
		is: "mysql",
		then: Joi.required(),
	}),
	DB_PASSWORD: Joi.string().when("DB_VENDOR", {
		is: "mysql",
		then: Joi.required(),
	}),
	DB_PORT: Joi.number().integer().when("DB_VENDOR", {
		is: "mysql",
		then: Joi.required(),
	}),
	DB_LOGGING: Joi.boolean().required(),
	DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

type CONFIG_GOOGLE_SCHEMA_TYPE = {
	GOOGLE_CLOUD_CREDENTIALS: object;
	GOOGLE_CLOUD_STORAGE_BUCKET: string;
};

export const CONFIG_GOOGLE_SCHEMA: Joi.StrictSchemaMap<CONFIG_GOOGLE_SCHEMA_TYPE> =
	{
		GOOGLE_CLOUD_CREDENTIALS: joiJson.object().required(),
		GOOGLE_CLOUD_STORAGE_BUCKET: Joi.string().required(),
	};

@Module({})
export class ConfigModule extends NestConfigModule {
	static forRoot(options: ConfigModuleOptions = {}) {
		const { envFilePath, ...otherOptions } = options;
		const nodeEnv = process.env.NODE_ENV || "development";

		const userEnvPaths: string[] = [];

		if (Array.isArray(envFilePath)) {
			userEnvPaths.push(
				...envFilePath.filter((p) => p !== undefined && p !== null),
			);
		} else if (envFilePath) {
			userEnvPaths.push(envFilePath);
		}

		const envPaths = [
			...userEnvPaths,
			join(process.cwd(), "envs", `.env.${nodeEnv}`),
			join(process.cwd(), "envs", `.env`),
		];

		return NestConfigModule.forRoot({
			isGlobal: true,
			envFilePath: envPaths,
			validationSchema: Joi.object({
				...CONFIG_DB_SCHEMA,
				...CONFIG_GOOGLE_SCHEMA,
			}),
			...otherOptions,
		});
	}
}
