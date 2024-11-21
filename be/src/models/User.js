'use strict';
const {
    Model
} = require('sequelize');

// user bao gồm: email, password, first_name, last_name, address, phone, gender, roleId, positionId
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        static associate(models) {
            user.hasOne(models.cart, { foreignKey: 'user_id', onDelete: 'SET NULL' });
            user.hasMany(models.order, { foreignKey: 'user_id', onDelete: 'SET NULL' });
            user.hasMany(models.product_follow, { foreignKey: 'user_id', onDelete: 'SET NULL' });
            user.hasMany(models.cost, { foreignKey: 'employee_id', onDelete: 'SET NULL' });
        }
    }
    user.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        hashed_password: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        gender: DataTypes.STRING,
        birth: DataTypes.DATE,
        role: DataTypes.STRING,
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'user',
        timestamps: true
    });
    return user;
}
