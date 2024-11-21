'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class product extends Model {
        static associate(models) {
            product.belongsTo(models.category, { foreignKey: 'category_id', onDelete: 'CASCADE' });
            product.hasMany(models.cart_item, { foreignKey: 'product_id', onDelete: 'SET NULL' });
            product.hasMany(models.order_item, { foreignKey: 'product_id', onDelete: 'SET NULL' });
            product.hasMany(models.product_option, { foreignKey: 'product_id', onDelete: 'SET NULL' });
            product.hasMany(models.product_follow, { foreignKey: 'product_id', onDelete: 'CASCADE' });
            product.hasMany(models.cost, { foreignKey: 'product_id', onDelete: 'SET NULL' });
        }
    }
    product.init({
        name: DataTypes.STRING,
        path: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        detail: DataTypes.TEXT,
        stock: DataTypes.BIGINT,
        price: DataTypes.DOUBLE,
        currency: DataTypes.STRING,
        category_id: DataTypes.TEXT,
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'product',
        timestamps: true
    });

    return product;
};
