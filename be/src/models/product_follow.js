'use-strict'
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class product_follow extends Model {
        static associate(models) {
            product_follow.belongsTo(models.product, { foreignKey: 'productId' });
            product_follow.belongsTo(models.user, { foreignKey: 'userId' });
        }
    }
    product_follow.init({
        productId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'product_follow',
        timestamps: true
    });

    return product_follow;
};