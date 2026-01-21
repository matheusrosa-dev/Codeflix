import { config as readEnv } from "dotenv";
import { join } from "path";
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

    return Config.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME;
  }

  static googleCredentials() {
    Config.readEnv();

    return JSON.parse(Config.env.GOOGLE_CLOUD_CREDENTIALS);
  }

  static readEnv() {
    if (Config.env) {
      return;
    }

    Config.env = readEnv({
      path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
      quiet: true,
    }).parsed;
  }
}
