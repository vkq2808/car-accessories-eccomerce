'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('costs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total_cost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      cost_type: {
        type: Sequelize.DataTypes.ENUM('PURCHASE', 'SALARY', 'MAINTENANCE', 'UTILITIES', 'MARKETING', 'OTHER'),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      subcategory: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'VND'
      },
      status: {
        type: Sequelize.DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      payment_method: {
        type: Sequelize.DataTypes.ENUM('CASH', 'BANK_TRANSFER', 'CARD', 'CHECK', 'OTHER'),
        allowNull: true
      },
      payment_reference: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      invoice_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      vendor_name: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      vendor_contact: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      receipt_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      incurred_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      paid_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      approval_note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      is_recurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      recurring_frequency: {
        type: Sequelize.DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'),
        allowNull: true
      },
      recurring_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('costs', ['invoice_number'], {
      unique: true,
      name: 'costs_invoice_number_unique'
    });
    await queryInterface.addIndex('costs', ['cost_type']);
    await queryInterface.addIndex('costs', ['category']);
    await queryInterface.addIndex('costs', ['product_id']);
    await queryInterface.addIndex('costs', ['employee_id']);
    await queryInterface.addIndex('costs', ['approved_by']);
    await queryInterface.addIndex('costs', ['status']);
    await queryInterface.addIndex('costs', ['total_cost']);
    await queryInterface.addIndex('costs', ['incurred_date']);
    await queryInterface.addIndex('costs', ['due_date']);
    await queryInterface.addIndex('costs', ['paid_date']);
    await queryInterface.addIndex('costs', ['is_recurring']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('costs');
  }
};