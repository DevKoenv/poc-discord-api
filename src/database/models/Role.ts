import {
  Association,
  DataTypes,
  Model,
  Sequelize,
  type BelongsToManyCountAssociationsMixin,
  type BelongsToManyGetAssociationsMixin,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "sequelize";
import type User from "./User";

class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<number>;

  // Custom fields
  declare name: string;

  // Role association methods
  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;

  // Inclusions
  declare users: NonAttribute<User[]>;

  // Associations
  public static associations: {
    users: Association<Role, User>;
  };

  // Initialization
  public static initialization(sequelize: Sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "roles",
        timestamps: false,
      }
    );
  }
}

export default Role;
