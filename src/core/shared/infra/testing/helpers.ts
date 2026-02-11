import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Config } from "../config";

export function setupSequelize(options: SequelizeOptions = {}) {
	let _sequelize: Sequelize;

	beforeEach(() => {
		_sequelize = new Sequelize({
			...options,
			...Config.db(),
		});
	});

	beforeEach(async () => {
		await _sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await _sequelize.close();
	});

	return {
		get sequelize() {
			return _sequelize;
		},
	};
}
