'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('carts', {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED'),
                allowNull: false,
                defaultValue: 'ACTIVE'
            },
            expires_at: {
                type: Sequelize.DATE,
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
            }
        });

        // Add indexes
        await queryInterface.addIndex('carts', ['user_id'], {
            unique: true,
            name: 'carts_user_id_unique'
        });
        await queryInterface.addIndex('carts', ['status']);
        await queryInterface.addIndex('carts', ['expires_at']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('carts');
    }
};