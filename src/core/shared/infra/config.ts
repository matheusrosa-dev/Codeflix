import { config as readEnv } from "dotenv";
import { join } from "path";

type Env = {
  DB_HOST: string;
  DB_LOGGING: string;
};

export class Config {
  static env: Env = null;

  static db() {
    Config.readEnv();

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dialect: "sqlite" as any,
      host: Config.env.DB_HOST,
      logging: false,
    };
  }

  static readEnv() {
    if (Config.env) {
      return;
    }

    Config.env = readEnv({
      path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
      quiet: true,
    }).parsed as Env;
  }
}
