'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class product extends Model {
        static associate(models) {
            product.belongsTo(models.category, { foreignKey: 'categoryId' });
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
        modelName: 'product',
        timestamps: true
    });

    return product;
};
