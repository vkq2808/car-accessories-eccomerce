'use strict';
const {
    Model
} = require('sequelize');

// Cart bao gồm id, createdAt, updatedAt, listCartItems
module.exports = (sequelize, DataTypes) => {
    class cart extends Model {
        static associate(models) {
            cart.hasMany(models.cart_item, { foreignKey: 'cart_id' });
            cart.belongsTo(models.user, { foreignKey: 'user_id' });
        }
    }
    cart.init({
        user_id: {
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