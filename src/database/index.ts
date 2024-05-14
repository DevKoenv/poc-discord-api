import { Sequelize, type Dialect } from "sequelize";
import { dbConfig } from "../config";
import User from "./models/User";
import Role from "./models/Role";
import Log from "./models/Log";
import Guild from "./models/Guild";
import Command from "./models/Command";

class Database {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(
      dbConfig.DB,
      dbConfig.USER,
      dbConfig.PASSWORD,
      {
        host: dbConfig.HOST,
        port: parseInt(dbConfig.PORT),
        dialect: dbConfig.dialect as Dialect,
        username: dbConfig.USER,
        password: dbConfig.PASSWORD,
        storage: dbConfig.storage,
        pool: {
          max: dbConfig.pool.max,
          min: dbConfig.pool.min,
          acquire: dbConfig.pool.acquire,
          idle: dbConfig.pool.idle,
        },
        define: {
          underscored: true,
        },
        logging: false,
      }
    );
  }

  private async syncModels() {
    const models = [User, Role, Log, Guild, Command];

    models.forEach((model) => model.initialization(this.sequelize));

    User.belongsToMany(Role, { through: "user_roles" });
    Role.belongsToMany(User, { through: "user_roles" });

    Guild.hasMany(Command);
    Command.belongsTo(Guild);
  }

  public async start(force?: boolean) {
    try {
      // Test the database connection
      await this.sequelize.authenticate();
      console.log(
        "Connection to the database has been established successfully."
      );

      // Sync the models
      this.syncModels();

      // Sync the database
      await this.sequelize.sync({
        force,
      });

      console.log("Database has been synced.");
    } catch (error) {
      console.error("Unable to sync the database:", error);
    }
  }

  public async stop() {
    try {
      await this.sequelize.close();
      console.log("Database connection closed.");
    } catch (error) {
      console.error("Unable to close the database connection:", error);
    }
  }
}

export default Database;
export { User, Role, Log, Guild, Command };
