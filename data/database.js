import mysql from "mysql2";
import { config } from "dotenv";

config({
      path: "./data/config.env",
});

const connection = mysql.createPool({
      host: process.env.DATABASE_HOST,
      port: process.env.DB_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE_NAME,
}).promise();

setTimeout(()=> console.log(`Database connected in ${process.env.DATABASE_HOST} and ` ) , 1);

export {connection};
