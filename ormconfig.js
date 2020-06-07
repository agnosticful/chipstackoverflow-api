require("dotenv/config");

const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  entities: ["entities/**/*.ts"],
  migrations: ["migrations/**/*.ts"],
  subscribers: ["subscribers/**/*.ts"],
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: "migrations",
  },
};
