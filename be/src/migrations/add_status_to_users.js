'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add status column to users table
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      after: 'last_login'
    });

    // Add index for status field
    await queryInterface.addIndex('users', ['status'], {
      name: 'users_status_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove index first
    await queryInterface.removeIndex('users', 'users_status_index');

    // Remove status column
    await queryInterface.removeColumn('users', 'status');
  }
};
