import { MigrationFn } from "umzug";
import { Sequelize, DataTypes } from "sequelize";
import { CastMemberTypes } from "../../../../domain/cast-member-type.vo";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("cast_members", {
    cast_member_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(CastMemberTypes)),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE(3),
      allowNull: false,
    },
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("cast_members");
};
