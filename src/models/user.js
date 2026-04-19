import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("users", {
    
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    }
}, {
    
    timestamps: true 
});

export default User;