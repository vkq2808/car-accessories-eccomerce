'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(sequelize.models.Product, { foreignKey: 'categoryId' });
        }
    }
    Category.init({
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        path: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Category',
        timestamps: true
    });
    return Category;
}
