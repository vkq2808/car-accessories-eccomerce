'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    static associate(models) {
      task.belongsTo(models.user, { foreignKey: 'assignedTo', onDelete: 'SET NULL', as: 'employee' });
    }
  }
  task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Chưa xử lý',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'task',
    timestamps: true,
  });
  return task;
};