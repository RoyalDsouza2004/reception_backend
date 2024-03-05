import mysql from "mysql2";
import { config } from "dotenv";

config({
      path: "./data/config.env",
});

const connection = mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: process.env.PASSWORD,
      database: "reception_management"
}).promise();

setTimeout(()=> console.log("database connected successfully") , 1);

export {connection};
