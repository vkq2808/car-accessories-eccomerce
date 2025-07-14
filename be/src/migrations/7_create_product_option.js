'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_options', {
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
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            price: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false
            },
            original_price: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: true
            },
            discount_percentage: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            sku: {
                type: Sequelize.STRING(50),
                allowNull: true,
                unique: true
            },
            weight: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: true
            },
            dimensions: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: {}
            },
            attributes: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: {}
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            sort_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            low_stock_threshold: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            image_url: {
                type: Sequelize.TEXT,
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
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });

        // Add indexes
        await queryInterface.addIndex('product_options', ['sku'], {
            unique: true,
            name: 'product_options_sku_unique'
        });
        await queryInterface.addIndex('product_options', ['product_id', 'name'], {
            unique: true,
            name: 'product_options_product_name_unique'
        });
        await queryInterface.addIndex('product_options', ['product_id']);
        await queryInterface.addIndex('product_options', ['is_active']);
        await queryInterface.addIndex('product_options', ['price']);
        await queryInterface.addIndex('product_options', ['stock']);
        await queryInterface.addIndex('product_options', ['sort_order']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('product_options');
    }
};