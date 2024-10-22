'use strict';
const {
    Model
} = require('sequelize');

// Cart bao gồm id, createdAt, updatedAt, listCartItems
module.exports = (sequelize, DataTypes) => {
    class cart extends Model {
        static associate(models) {
            cart.hasMany(models.cart_item, { foreignKey: 'cartId' });
            cart.belongsTo(models.user, { foreignKey: 'userId' });
        }
    }
    cart.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'cart',
        timestamps: true
    });
    return cart;
}