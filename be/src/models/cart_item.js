'use strict';
const {
    Model
} = require('sequelize');

// cart_item bao gồm: cart_id, product_id, serviceId, quantity
module.exports = (sequelize, DataTypes) => {
    class cart_item extends Model {
        static associate(models) {
            cart_item.belongsTo(models.cart, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
            cart_item.belongsTo(models.product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
            cart_item.belongsTo(models.product_option, { foreignKey: 'product_option_id', onDelete: 'SET NULL' });
        }
    }
    cart_item.init({
        cart_id: DataTypes.BIGINT,
        product_id: DataTypes.BIGINT,
        product_option_id: DataTypes.BIGINT,
        quantity: DataTypes.BIGINT
    }, {
        sequelize,
        modelName: 'cart_item',
        timestamps: true
    });
    return cart_item;
}