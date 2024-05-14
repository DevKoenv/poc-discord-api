import {
  DataTypes,
  Model,
  Sequelize,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";

class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
  declare id: CreationOptional<number>;

  // Custom fields
  declare level: string;
  declare message: string;
  declare stack: CreationOptional<string>;
  declare timestamp: Date;

  // Associations
  public static associations: {};

  // Initialization
  public static initialization(sequelize: Sequelize) {
    super.init(
      {
        level: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        message: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        stack: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "logs",
        timestamps: false,
      }
    );
  }
}

export default Log;
