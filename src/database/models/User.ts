import {
  Association,
  DataTypes,
  Model,
  Sequelize,
  type BelongsToManyAddAssociationMixin,
  type BelongsToManyAddAssociationsMixin,
  type BelongsToManyCountAssociationsMixin,
  type BelongsToManyCreateAssociationMixin,
  type BelongsToManyGetAssociationsMixin,
  type BelongsToManyHasAssociationMixin,
  type BelongsToManyHasAssociationsMixin,
  type BelongsToManyRemoveAssociationMixin,
  type BelongsToManyRemoveAssociationsMixin,
  type BelongsToManySetAssociationsMixin,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "sequelize";
import type Role from "./Role";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // Custom fields
  declare id: string;
  declare username: string;
  declare globalName: string;
  declare avatar: CreationOptional<string>;
  declare email: CreationOptional<string>;
  declare refreshToken: string;

  // Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association methods
  declare addRole: BelongsToManyAddAssociationMixin<Role, Role["id"]>;
  declare addRoles: BelongsToManyAddAssociationsMixin<Role, Role["id"]>;
  declare countRoles: BelongsToManyCountAssociationsMixin;
  declare createRole: BelongsToManyCreateAssociationMixin<Role>;
  declare getRoles: BelongsToManyGetAssociationsMixin<Role>;
  declare hasRole: BelongsToManyHasAssociationMixin<Role, Role["id"]>;
  declare hasRoles: BelongsToManyHasAssociationsMixin<Role, Role["id"]>;
  declare removeRole: BelongsToManyRemoveAssociationMixin<Role, Role["id"]>;
  declare removeRoles: BelongsToManyRemoveAssociationsMixin<Role, Role["id"]>;
  declare setRoles: BelongsToManySetAssociationsMixin<Role, Role["id"]>;

  // Inclusions
  declare roles: NonAttribute<Role[]>;

  // Associations
  public static associations: {
    roles: Association<User, Role>;
  };

  // Initialization
  public static async initialization(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        globalName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        refreshToken: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "users",
      }
    );
  }
}

export default User;
