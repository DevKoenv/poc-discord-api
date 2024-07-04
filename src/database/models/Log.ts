import {
  DataTypes,
  Model,
  Sequelize,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  Op,
} from "sequelize";
import Logger from "../../utils/logger";

class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
  declare id: CreationOptional<number>;

  // Custom fields
  declare level: string;
  declare message: string;
  declare stacktrace: CreationOptional<string>
  declare date: Date;

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
        date: {
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

  /**
   * Deletes logs older than a specified number of days.
   * @param days The number of days after which logs should be deleted.
   */
  public static async deleteOldLogs(days: number): Promise<void> {
    Logger.db("Deleting logs older than %s days.", days);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    await Log.destroy({
      where: {
        date: {
          [Op.lt]: cutoffDate,
        },
      },
    });
  }
}

export default Log;
