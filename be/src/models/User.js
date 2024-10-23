'use strict';
const {
    Model
} = require('sequelize');

// user bao gồm: email, password, firstName, lastName, address, phone, gender, roleId, positionId
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        static associate(models) {
            user.hasOne(models.cart, { foreignKey: 'userId' });
        }
    }
    user.init({
        email: DataTypes.STRING,
        hashed_password: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        gender: DataTypes.STRING,
        birth: DataTypes.DATE,
        role: DataTypes.STRING,
        imageUrl: {
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
