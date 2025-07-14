'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(300),
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      event_type: {
        type: Sequelize.ENUM('MEETING', 'CONFERENCE', 'WORKSHOP', 'TRAINING', 'SOCIAL', 'MAINTENANCE', 'PROMOTION', 'OTHER'),
        allowNull: false,
        defaultValue: 'OTHER'
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      visibility: {
        type: Sequelize.ENUM('PUBLIC', 'PRIVATE', 'INTERNAL'),
        allowNull: false,
        defaultValue: 'PUBLIC'
      },
      max_attendees: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      current_attendees: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      registration_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      registration_deadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      contact_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      is_recurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      recurring_pattern: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      reminder_settings: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          enabled: true,
          intervals: [24, 2]
        }
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
    await queryInterface.addIndex('events', ['date']);
    await queryInterface.addIndex('events', ['end_date']);
    await queryInterface.addIndex('events', ['event_type']);
    await queryInterface.addIndex('events', ['status']);
    await queryInterface.addIndex('events', ['visibility']);
    await queryInterface.addIndex('events', ['created_by']);
    await queryInterface.addIndex('events', ['registration_required']);
    await queryInterface.addIndex('events', ['registration_deadline']);
    await queryInterface.addIndex('events', ['is_recurring']);
    await queryInterface.addIndex('events', ['title']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events');
  }
};
