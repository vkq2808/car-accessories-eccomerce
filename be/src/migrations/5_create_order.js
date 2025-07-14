'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      order_number: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'FINISHED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'VND'
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      shipping_address: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      billing_address: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      customer_info: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      payment_method: {
        type: Sequelize.ENUM('COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'),
        allowNull: true
      },
      payment_status: {
        type: Sequelize.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      notes: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      estimated_delivery: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancelled_reason: {
        type: Sequelize.TEXT,
        allowNull: true
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
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('orders', ['order_number'], {
      unique: true,
      name: 'orders_order_number_unique'
    });
    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['payment_status']);
    await queryInterface.addIndex('orders', ['payment_method']);
    await queryInterface.addIndex('orders', ['total_amount']);
    await queryInterface.addIndex('orders', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};