export const config = {
  dialect: process.env.DB_DIALECT || "sqlite",
  HOST: process.env.DB_HOST || "localhost",
  PORT: process.env.DB_PORT || "3306",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASS || "",
  DB: process.env.DB_NAME || "poc-discord",
  storage: process.env.DB_STORAGE || ":memory:",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
