import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Productos = sequelize.define('productos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    descripcion: {
        type:DataTypes.TEXT  
    },
    
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: true, //createAt Y updateAt
});

export default Productos;