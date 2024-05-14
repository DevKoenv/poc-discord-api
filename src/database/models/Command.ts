import {
  Association,
  DataTypes,
  Model,
  Sequelize,
  type BelongsToGetAssociationMixin,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "sequelize";
import type Guild from "./Guild";
import type { ResponseJson } from "../../../types/command";

class Command extends Model<
  InferAttributes<Command>,
  InferCreationAttributes<Command>
> {
  declare id: CreationOptional<number>;

  // Custom fields
  declare trigger: string;
  declare response: string;
  declare interaction: CreationOptional<string>;

  // Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association methods
  declare getGuild: BelongsToGetAssociationMixin<Guild>;

  // Inclusions
  declare guild: NonAttribute<Guild>;

  // Associations
  public static associations: {
    guild: Association<Command, Guild>;
  };

  // Initialization
  public static initialization(sequelize: Sequelize) {
    super.init(
      {
        trigger: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        response: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        interaction: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "commands",
      }
    );
  }
}

export default Command;
