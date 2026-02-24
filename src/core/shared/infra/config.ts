import { config as readEnv } from "dotenv";
import { join } from "node:path";
import { SequelizeOptions } from "sequelize-typescript";

export class Config {
	static env: any = null;

	static db(): SequelizeOptions {
		Config.readEnv();

		return {
			dialect: "sqlite",
			host: Config.env.DB_HOST,
			logging: false,
		};
	}

	static bucketName() {
		Config.readEnv();

		return Config.env.GOOGLE_CLOUD_STORAGE_BUCKET;
	}

	static googleCredentials() {
		Config.readEnv();

		return JSON.parse(Config.env.GOOGLE_CLOUD_CREDENTIALS);
	}

	static rabbitmqUri() {
		Config.readEnv();

		return Config.env.RABBITMQ_URI;
	}

	static readEnv() {
		if (Config.env) {
			return;
		}

		const { parsed } = readEnv({
			path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
		});

		Config.env = {
			...parsed,
			...process.env,
		};
	}
}
