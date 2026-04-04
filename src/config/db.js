import { Sequelize } from "sequelize";
import dotenv from "dotenv";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DIALECT } = process.env

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DIALECT,
    logging : false //para reducir los datos que recibimos a 3 lineas en la consola, en vez de mostrar toda la consulta SQL
});

export default sequelize;