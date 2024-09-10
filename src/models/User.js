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
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        gender: DataTypes.STRING,
        roleId: DataTypes.INTEGER,
        positionId: DataTypes.INTEGER,
        imgaeUrl: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
}
