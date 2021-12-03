const dotenv = require("dotenv");

// retrieve configurations from .env
// after running this line, value in .env will be populated into process.env
dotenv.config();

// it is safer to name one connection as 'default'.
// As BaseEntity executes query on connection name 'default'

// when connnection to one database only,
// name can be ignored and will be assumed as 'default'
module.exports = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: ["dist/entities/**/*.js"],
  migrations: ["dist/migrations/**/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
};
