import { Sequelize } from 'sequelize';

function initDb() {
  const db = new Sequelize({
    dialect: 'postgres',
    // host: '127.0.0.1',
    // port: 5432,
    // database: 'fingerprint_management_main_db',
    // username: 'postgres',
    // password: 'root',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
  });
  return db;
}

export default initDb;
