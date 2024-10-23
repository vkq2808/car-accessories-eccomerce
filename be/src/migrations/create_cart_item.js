'use-strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('cart_items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            cartId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'carts',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            productId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            // serviceId: {
            //     type: Sequelize.INTEGER,
            //     references: {
            //         model: 'services',
            //         key: 'id'
            //     },
            //     onUpdate: 'CASCADE',
            //     onDelete: 'CASCADE'
            // },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
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
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('cart_items');
    }
};