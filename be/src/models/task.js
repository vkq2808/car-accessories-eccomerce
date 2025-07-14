'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            Task.belongsTo(models.user, {
                foreignKey: 'employee_id',
                onDelete: 'SET NULL',
                as: 'employee'
            });
            Task.belongsTo(models.user, {
                foreignKey: 'admin_id',
                onDelete: 'SET NULL',
                as: 'admin'
            });
        }

        // Instance Methods
        isPending() {
            return this.status === 'PENDING';
        }

        isInProgress() {
            return this.status === 'IN_PROGRESS';
        }

        isAwaitingConfirmation() {
            return this.status === 'AWAITING_CONFIRMATION';
        }

        isCompleted() {
            return this.status === 'COMPLETED';
        }

        isRejected() {
            return this.status === 'REJECTED';
        }

        isCancelled() {
            return this.status === 'CANCELLED';
        }

        isOverdue() {
            return this.deadline && new Date() > new Date(this.deadline) && !this.isCompleted();
        }

        canBeStarted() {
            return this.status === 'PENDING';
        }

        canBeCompleted() {
            return this.status === 'IN_PROGRESS';
        }

        canBeRejected() {
            return ['PENDING', 'IN_PROGRESS', 'AWAITING_CONFIRMATION'].includes(this.status);
        }

        canBeCancelled() {
            return ['PENDING', 'IN_PROGRESS'].includes(this.status);
        }

        getDaysRemaining() {
            if (!this.deadline) return null;
            const now = new Date();
            const deadline = new Date(this.deadline);
            const diffTime = deadline - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }

        getTimeSpent() {
            if (!this.started_at) return 0;
            const end = this.completed_at || new Date();
            const start = new Date(this.started_at);
            return Math.floor((end - start) / (1000 * 60 * 60)); // Hours
        }

        async startTask() {
            if (!this.canBeStarted()) {
                throw new Error('Task cannot be started in current status');
            }

            this.status = 'IN_PROGRESS';
            this.started_at = new Date();
            this.progress = 0;

            return await this.save();
        }

        async completeTask(note = null) {
            if (!this.canBeCompleted()) {
                throw new Error('Task cannot be completed in current status');
            }

            this.status = 'AWAITING_CONFIRMATION';
            this.progress = 100;
            this.completion_note = note;

            return await this.save();
        }

        async confirmCompletion(adminId, note = null) {
            if (this.status !== 'AWAITING_CONFIRMATION') {
                throw new Error('Task is not awaiting confirmation');
            }

            this.status = 'COMPLETED';
            this.completed_at = new Date();
            this.confirmed_by = adminId;
            this.confirmation_note = note;

            return await this.save();
        }

        async rejectTask(adminId, reason) {
            if (!this.canBeRejected()) {
                throw new Error('Task cannot be rejected in current status');
            }

            this.status = 'REJECTED';
            this.rejected_by = adminId;
            this.rejected_at = new Date();
            this.rejection_reason = reason;

            return await this.save();
        }

        async cancelTask(adminId, reason) {
            if (!this.canBeCancelled()) {
                throw new Error('Task cannot be cancelled in current status');
            }

            this.status = 'CANCELLED';
            this.cancelled_by = adminId;
            this.cancelled_at = new Date();
            this.cancellation_reason = reason;

            return await this.save();
        }

        async updateProgress(progress, note = null) {
            if (!this.isInProgress()) {
                throw new Error('Cannot update progress of task that is not in progress');
            }

            this.progress = Math.max(0, Math.min(100, progress));
            this.last_updated = new Date();

            if (note) {
                this.progress_notes = this.progress_notes || [];
                this.progress_notes.push({
                    progress: this.progress,
                    note: note,
                    timestamp: new Date()
                });
            }

            return await this.save();
        }

        toJSON() {
            const data = this.get();
            return {
                ...data,
                is_pending: this.isPending(),
                is_in_progress: this.isInProgress(),
                is_awaiting_confirmation: this.isAwaitingConfirmation(),
                is_completed: this.isCompleted(),
                is_rejected: this.isRejected(),
                is_cancelled: this.isCancelled(),
                is_overdue: this.isOverdue(),
                can_be_started: this.canBeStarted(),
                can_be_completed: this.canBeCompleted(),
                can_be_rejected: this.canBeRejected(),
                can_be_cancelled: this.canBeCancelled(),
                days_remaining: this.getDaysRemaining(),
                time_spent_hours: this.getTimeSpent(),
                employee_name: data.employee ? `${data.employee.first_name} ${data.employee.last_name}` : null,
                admin_name: data.admin ? `${data.admin.first_name} ${data.admin.last_name}` : null
            };
        }
    }

    Task.init({
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Title cannot be empty'
                },
                len: {
                    args: [1, 200],
                    msg: 'Title must be between 1 and 200 characters'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 5000],
                    msg: 'Description must be less than 5000 characters'
                }
            }
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'AWAITING_CONFIRMATION', 'COMPLETED', 'REJECTED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING'
        },
        priority: {
            type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
            allowNull: false,
            defaultValue: 'MEDIUM'
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Category must be less than 100 characters'
                }
            }
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        confirmed_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        rejected_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        cancelled_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        assigned_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        started_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Please provide a valid deadline'
                },
                isAfterAssigned(value) {
                    if (value && this.assigned_date && new Date(value) < new Date(this.assigned_date)) {
                        throw new Error('Deadline must be after assigned date');
                    }
                }
            }
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        confirmed_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        rejected_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancelled_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: 0,
                    msg: 'Progress cannot be less than 0'
                },
                max: {
                    args: 100,
                    msg: 'Progress cannot be more than 100'
                }
            }
        },
        estimated_hours: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            validate: {
                min: {
                    args: 0,
                    msg: 'Estimated hours cannot be negative'
                }
            }
        },
        actual_hours: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            validate: {
                min: {
                    args: 0,
                    msg: 'Actual hours cannot be negative'
                }
            }
        },
        completion_note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        confirmation_note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cancellation_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        progress_notes: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        attachments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        last_updated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'task',
        tableName: 'tasks',
        timestamps: true,
        paranoid: true, // Soft delete
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deleted_at: 'deleted_at',
        indexes: [
            {
                fields: ['employee_id']
            },
            {
                fields: ['admin_id']
            },
            {
                fields: ['status']
            },
            {
                fields: ['priority']
            },
            {
                fields: ['category']
            },
            {
                fields: ['assigned_date']
            },
            {
                fields: ['deadline']
            },
            {
                fields: ['completed_at']
            },
            {
                fields: ['progress']
            },
            {
                fields: ['last_updated']
            }
        ],
        hooks: {
            beforeCreate: (task) => {
                // Set assigned_date to current time if not provided
                if (!task.assigned_date) {
                    task.assigned_date = new Date();
                }
                // Set last_updated to current time
                task.last_updated = new Date();
            },
            beforeUpdate: (task) => {
                // Update last_updated timestamp
                task.last_updated = new Date();

                // Set completed_at when status changes to COMPLETED
                if (task.changed('status') && task.status === 'COMPLETED') {
                    task.completed_at = new Date();
                }

                // Set rejected_at when status changes to REJECTED
                if (task.changed('status') && task.status === 'REJECTED') {
                    task.rejected_at = new Date();
                }

                // Set cancelled_at when status changes to CANCELLED
                if (task.changed('status') && task.status === 'CANCELLED') {
                    task.cancelled_at = new Date();
                }
            }
        }
    });

    return Task;
}
