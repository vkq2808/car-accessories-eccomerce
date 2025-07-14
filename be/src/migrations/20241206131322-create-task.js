'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'AWAITING_CONFIRMATION', 'COMPLETED', 'REJECTED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            priority: {
                type: Sequelize.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
                allowNull: false,
                defaultValue: 'MEDIUM'
            },
            category: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            employee_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            admin_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            confirmed_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            rejected_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            cancelled_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            assigned_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            completed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            confirmed_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            rejected_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            cancelled_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            progress: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            estimated_hours: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: true
            },
            actual_hours: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: true
            },
            completion_note: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            confirmation_note: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            rejection_reason: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            cancellation_reason: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            progress_notes: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: []
            },
            attachments: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: []
            },
            tags: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: []
            },
            last_updated: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });

        // Add indexes
        await queryInterface.addIndex('tasks', ['employee_id']);
        await queryInterface.addIndex('tasks', ['admin_id']);
        await queryInterface.addIndex('tasks', ['priority']);
        await queryInterface.addIndex('tasks', ['category']);
        await queryInterface.addIndex('tasks', ['assigned_date']);
        await queryInterface.addIndex('tasks', ['deadline']);
        await queryInterface.addIndex('tasks', ['progress']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tasks');
    },
};
