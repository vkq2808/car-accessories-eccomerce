'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('cart_items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            cart_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'carts',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            product_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            product_option_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'product_options',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: true
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            unit_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            note: {
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
            }
        });

        // Add indexes
        await queryInterface.addIndex('cart_items', ['cart_id', 'product_id', 'product_option_id'], {
            unique: true,
            name: 'cart_items_unique_constraint'
        });
        await queryInterface.addIndex('cart_items', ['cart_id']);
        await queryInterface.addIndex('cart_items', ['product_id']);
        await queryInterface.addIndex('cart_items', ['product_option_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('cart_items');
    }
};