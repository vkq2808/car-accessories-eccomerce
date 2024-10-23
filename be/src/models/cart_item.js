'use strict';
const {
    Model
} = require('sequelize');

// cart_item bao gồm: cartId, productId, serviceId, quantity
module.exports = (sequelize, DataTypes) => {
    class cart_item extends Model {
        static associate(models) {
            cart_item.belongsTo(models.cart, { foreignKey: 'cartId' });
            cart_item.belongsTo(models.product, { foreignKey: 'productId', allowNull: true });
            // cart_item.belongsTo(models.service, { foreignKey: 'serviceId', allowNull: true });
        }
    }
    cart_item.init({
        cartId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        // serviceId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'cart_item',
        timestamps: true
    });
    return cart_item;
}