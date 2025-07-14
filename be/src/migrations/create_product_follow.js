'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_follows', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            notification_enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            followed_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            last_notification_sent: {
                type: Sequelize.DATE,
                allowNull: true
            },
            notification_preferences: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: JSON.stringify({
                    price_drop: true,
                    back_in_stock: true,
                    new_variant: false,
                    promotion: true
                })
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
        await queryInterface.addIndex('product_follows', ['product_id', 'user_id'], {
            unique: true,
            name: 'product_follows_product_user_unique'
        });
        await queryInterface.addIndex('product_follows', ['product_id']);
        await queryInterface.addIndex('product_follows', ['user_id']);
        await queryInterface.addIndex('product_follows', ['notification_enabled']);
        await queryInterface.addIndex('product_follows', ['followed_at']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('product_follows');
    }
};