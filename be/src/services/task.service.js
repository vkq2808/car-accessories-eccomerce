import db from '../models';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/enum';

class TaskService {
    constructor() {
        this.model = db.task;
    }

    async create(data) {
        try {
            const taskData = {
                ...data,
                status: data.status || TASK_STATUS.PENDING,
                priority: data.priority || TASK_PRIORITY.MEDIUM,
                progress: data.progress || 0,
                estimated_hours: data.estimated_hours || null,
                actual_hours: data.actual_hours || null,
                attachments: data.attachments || [],
                tags: data.tags || [],
                metadata: data.metadata || {}
            };

            return await this.model.create(taskData);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAll(options = {}) {
        try {
            // Add soft delete filter by default
            const whereCondition = options.where ?
                { ...options.where, deleted_at: null } :
                { deleted_at: null };

            return await this.model.findAll({
                ...options,
                where: whereCondition,
                include: [
                    {
                        model: db.user,
                        as: 'assigned_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: db.user,
                        as: 'created_by_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ],
                order: options.order || [['created_at', 'DESC']]
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getOne(options = {}) {
        try {
            // Add soft delete filter by default
            const whereCondition = options.where ?
                { ...options.where, deleted_at: null } :
                { deleted_at: null };

            return await this.model.findOne({
                ...options,
                where: whereCondition,
                include: [
                    {
                        model: db.user,
                        as: 'assigned_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: db.user,
                        as: 'created_by_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ]
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(data) {
        try {
            const { id, ...updates } = data;
            await this.model.update(updates, {
                where: {
                    id,
                    deleted_at: null
                }
            });
            return await this.getOne({ where: { id } });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            return await this.model.destroy({
                where: {
                    id,
                    deleted_at: null
                }
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Additional methods for task management
    async getById(id) {
        try {
            return await this.getOne({ where: { id } });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getTasksByStatus(status, options = {}) {
        try {
            return await this.model.findAll({
                where: {
                    status: status,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.user,
                        as: 'assigned_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: db.user,
                        as: 'created_by_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ],
                order: [['created_at', 'DESC']],
                ...options
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getTasksByAssignedUser(user_id, options = {}) {
        try {
            return await this.model.findAll({
                where: {
                    assigned_to: user_id,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.user,
                        as: 'created_by_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ],
                order: [['created_at', 'DESC']],
                ...options
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getTasksByCreatedBy(user_id, options = {}) {
        try {
            return await this.model.findAll({
                where: {
                    created_by: user_id,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.user,
                        as: 'assigned_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ],
                order: [['created_at', 'DESC']],
                ...options
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateStatus(task_id, status) {
        try {
            const task = await this.model.findOne({
                where: {
                    id: task_id,
                    deleted_at: null
                }
            });

            if (task) {
                task.status = status;

                if (status === TASK_STATUS.IN_PROGRESS) {
                    task.started_at = new Date();
                } else if (status === TASK_STATUS.COMPLETED) {
                    task.completed_at = new Date();
                    task.progress = 100;
                }

                await task.save();
                return task;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateProgress(task_id, progress) {
        try {
            const task = await this.model.findOne({
                where: {
                    id: task_id,
                    deleted_at: null
                }
            });

            if (task) {
                task.progress = Math.min(100, Math.max(0, progress));

                if (progress === 100 && task.status !== TASK_STATUS.COMPLETED) {
                    task.status = TASK_STATUS.COMPLETED;
                    task.completed_at = new Date();
                } else if (progress > 0 && task.status === TASK_STATUS.PENDING) {
                    task.status = TASK_STATUS.IN_PROGRESS;
                    task.started_at = new Date();
                }

                await task.save();
                return task;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async assignTask(task_id, assigned_to) {
        try {
            const task = await this.model.findOne({
                where: {
                    id: task_id,
                    deleted_at: null
                }
            });

            if (task) {
                task.assigned_to = assigned_to;
                await task.save();
                return task;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getTasksByPriority(priority, options = {}) {
        try {
            return await this.model.findAll({
                where: {
                    priority: priority,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.user,
                        as: 'assigned_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: db.user,
                        as: 'created_by_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ],
                order: [['created_at', 'DESC']],
                ...options
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getOverdueTasks(options = {}) {
        try {
            return await this.model.findAll({
                where: {
                    due_date: { [db.Sequelize.Op.lt]: new Date() },
                    status: { [db.Sequelize.Op.notIn]: [TASK_STATUS.COMPLETED, TASK_STATUS.CANCELLED] },
                    deleted_at: null
                },
                include: [
                    {
                        model: db.user,
                        as: 'assigned_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: db.user,
                        as: 'created_by_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ],
                order: [['due_date', 'ASC']],
                ...options
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async searchAndCountAll(options = {}) {
        try {
            // Add soft delete filter by default
            const whereCondition = options.where ?
                { ...options.where, deleted_at: null } :
                { deleted_at: null };

            const { rows, count } = await this.model.findAndCountAll({
                ...options,
                where: whereCondition,
                include: [
                    {
                        model: db.user,
                        as: 'assigned_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: db.user,
                        as: 'created_by_user',
                        where: { deleted_at: null },
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }
                ],
                order: options.order || [['created_at', 'DESC']]
            });
            return { rows, count };
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default TaskService;
