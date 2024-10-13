'use strict';
const {
    Model
} = require('sequelize');
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.STRING
            },
            role: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            imageUrl: {
                type: Sequelize.STRING
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
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
}