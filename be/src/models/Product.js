'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
        }
    }
    Product.init({
        name: DataTypes.STRING,
        path: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        detail: DataTypes.TEXT,
        quantity: DataTypes.INTEGER,
        price: DataTypes.DOUBLE,
        currency: DataTypes.STRING,
        categoryId: DataTypes.TEXT,
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Product',
        timestamps: true
    });

    return Product;
};
