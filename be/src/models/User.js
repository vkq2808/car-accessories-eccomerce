'use strict';
const {
    Model
} = require('sequelize');

// user bao gồm: email, password, firstName, lastName, address, phone, gender, roleId, positionId
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
        }
    }
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        gender: DataTypes.STRING,
        role: DataTypes.INTEGER,
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true
    });
    return User;
}
