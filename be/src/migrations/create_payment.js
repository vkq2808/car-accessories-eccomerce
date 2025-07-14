'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      method: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      bank_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'VND'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      transaction_info: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      transaction_status: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      transaction_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      transaction_data: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      payment_gateway: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      gateway_transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      refund_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      refund_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      refunded_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('payments', ['order_id']);
    await queryInterface.addIndex('payments', ['transaction_id'], {
      unique: true,
      name: 'payments_transaction_id_unique'
    });
    await queryInterface.addIndex('payments', ['status']);
    await queryInterface.addIndex('payments', ['method']);
    await queryInterface.addIndex('payments', ['payment_gateway']);
    await queryInterface.addIndex('payments', ['amount']);
    await queryInterface.addIndex('payments', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};