'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            path: {
                type: Sequelize.STRING(200),
                unique: true,
                allowNull: false
            },
            image_url: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            parent_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            sort_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            meta_title: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            meta_description: {
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
        await queryInterface.addIndex('categories', ['path'], {
            unique: true,
            name: 'categories_path_unique'
        });
        await queryInterface.addIndex('categories', ['parent_id']);
        await queryInterface.addIndex('categories', ['is_active']);
        await queryInterface.addIndex('categories', ['sort_order']);
        await queryInterface.addIndex('categories', ['name']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('categories');
    }
};
