'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class order_item extends Model {
    static associate(models) {
      order_item.belongsTo(models.order, { foreignKey: 'order_id' });
      order_item.belongsTo(models.product, { foreignKey: 'product_id' });
    }
  }
  order_item.init({
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }, currency: {
      type: DataTypes.STRING,
      allowNull: false
    }, note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'order_item',
    timestamps: true
  });
  return order_item;
}