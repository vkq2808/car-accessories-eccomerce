'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING, TEXT, ENUM, BOOLEAN, INTEGER, JSON, DATE } = Sequelize;

    await queryInterface.createTable('settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: BIGINT
      },
      key: {
        type: STRING(100),
        allowNull: false,
        unique: true
      },
      value: {
        type: TEXT,
        allowNull: true
      },
      default_value: {
        type: TEXT,
        allowNull: true
      },
      data_type: {
        type: ENUM('string', 'number', 'boolean', 'json', 'array'),
        allowNull: false,
        defaultValue: 'string'
      },
      category: {
        type: ENUM('SYSTEM', 'USER', 'GENERAL', 'PAYMENT', 'EMAIL', 'SECURITY', 'APPEARANCE', 'NOTIFICATION', 'API'),
        allowNull: false,
        defaultValue: 'GENERAL'
      },
      description: {
        type: TEXT,
        allowNull: true
      },
      visibility: {
        type: ENUM('PUBLIC', 'PRIVATE', 'INTERNAL'),
        allowNull: false,
        defaultValue: 'PRIVATE'
      },
      is_active: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_readonly: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      validation_rules: {
        type: JSON,
        allowNull: true,
        defaultValue: '{}'
      },
      updated_by: {
        type: INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      sort_order: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tags: {
        type: JSON,
        allowNull: true,
        defaultValue: '[]'
      },
      metadata: {
        type: JSON,
        allowNull: true,
        defaultValue: '{}'
      },
      created_at: {
        allowNull: false,
        type: DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('settings', ['key'], { unique: true });
    await queryInterface.addIndex('settings', ['category']);
    await queryInterface.addIndex('settings', ['data_type']);
    await queryInterface.addIndex('settings', ['visibility']);
    await queryInterface.addIndex('settings', ['is_active']);
    await queryInterface.addIndex('settings', ['is_readonly']);
    await queryInterface.addIndex('settings', ['updated_by']);
    await queryInterface.addIndex('settings', ['sort_order']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('settings');
  }
};