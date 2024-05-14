import {
  Association,
  DataTypes,
  Model,
  Sequelize,
  type CreationOptional,
  type HasManyCreateAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManyRemoveAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "sequelize";
import type Command from "./Command";

class Guild extends Model<
  InferAttributes<Guild>,
  InferCreationAttributes<Guild>
> {
  // Custom fields
  declare id: string;
  declare name: string;
  declare icon: CreationOptional<string>;
  declare prefix: CreationOptional<string>;
  declare language: CreationOptional<string>;

  // Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association methods
  declare getCommands: HasManyGetAssociationsMixin<Command>;
  declare createCommand: HasManyCreateAssociationMixin<Command>;
  declare removeCommand: HasManyRemoveAssociationMixin<Command, Command["id"]>;

  // Inclusions
  declare commands: NonAttribute<Command[]>;

  // Associations
  public static associations: {
    commands: Association<Guild, Command>;
  };

  // Initialization
  public static initialization(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        icon: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        prefix: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "!",
        },
        language: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "en",
        },
      },
      {
        sequelize,
        modelName: "guilds",
      }
    );
  }
}

export default Guild;
