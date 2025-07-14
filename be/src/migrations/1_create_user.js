'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING(255),
                unique: true,
                allowNull: false
            },
            hashed_password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            first_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            gender: {
                type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
                allowNull: true,
                defaultValue: 'OTHER'
            },
            birth: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            role: {
                type: Sequelize.ENUM('NO_ROLE', 'USER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'),
                allowNull: false,
                defaultValue: 'USER'
            },
            image_url: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            email_verified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            email_verified_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            last_login: {
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
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });

        // Add indexes
        await queryInterface.addIndex('users', ['email'], {
            unique: true,
            name: 'users_email_unique'
        });
        await queryInterface.addIndex('users', ['role']);
        await queryInterface.addIndex('users', ['is_active']);
        await queryInterface.addIndex('users', ['phone']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};