'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    static associate(models) {
      order.hasMany(models.order_item, { foreignKey: 'order_id' });
      order.belongsTo(models.user, { foreignKey: 'user_id' });
    }
  }
  order.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    discount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'order',
    timestamps: true
  });
  return order;
}