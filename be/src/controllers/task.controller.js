import db from '../models';
import { TaskService } from '../services';
import { USER_ROLES, TASK_STATUS, TASK_PRIORITY } from '../constants/enum';

class TaskController {
    // Tạo mới task
    async create(req, res) {
        try {
            const { title, description, employee_id, deadline, priority } = req.body;

            if (!title || !employee_id) {
                return res.status(400).json({ message: "Missing required fields: title, employee_id" });
            }

            // Validate user role
            if (req.user.role !== USER_ROLES.ADMIN && req.user.role !== USER_ROLES.SUPER_ADMIN) {
                return res.status(403).json({ message: "You don't have permission to create tasks" });
            }

            const newTask = await new TaskService().create({
                title,
                description,
                employee_id,
                admin_id: req.user.id,
                deadline,
                priority: priority || TASK_PRIORITY.MEDIUM,
                status: TASK_STATUS.PENDING
            });

            return res.status(201).json({ message: "Task created successfully", task: newTask });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Cập nhật task
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const task = await new TaskService().getOne({ where: { id } });

            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            // Kiểm tra quyền truy cập: chỉ admin hoặc employee có quyền sửa task
            if (req.user.role !== USER_ROLES.ADMIN && req.user.id !== task.employee_id && req.user.role !== USER_ROLES.SUPER_ADMIN) {
                return res.status(403).json({ message: "You don't have permission to update this task" });
            }

            delete updates.id; // Prevent ID from being updated
            const updatedTask = await new TaskService().update(id, updates);

            return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Lấy danh sách tất cả task
    async getAll(req, res) {
        try {
            const isAdminOrSuperAdmin = req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.SUPER_ADMIN;

            const tasks = await new TaskService().getAll({
                where: isAdminOrSuperAdmin ? {} : { employee_id: req.user.id },
                include: [
                    { model: db.user, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'email'] },
                    { model: db.user, as: 'admin', attributes: ['id', 'first_name', 'last_name', 'email'] },
                ],
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({ tasks });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Xóa task
    async delete(req, res) {
        try {
            const { id } = req.params;

            const task = await new TaskService().getOne({ where: { id } });

            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            // Kiểm tra xem người dùng có phải là admin hoặc super admin không
            if (req.user.role !== USER_ROLES.ADMIN && req.user.role !== USER_ROLES.SUPER_ADMIN) {
                return res.status(403).json({ message: "You don't have permission to delete this task" });
            }

            await new TaskService().delete(id);

            return res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const task = await new TaskService().getOne({
                where: { id },
                include: [
                    { model: db.user, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'email'] },
                    { model: db.user, as: 'admin', attributes: ['id', 'first_name', 'last_name', 'email'] },
                ]
            });

            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            // Check if user has permission to view this task
            const isAdminOrSuperAdmin = req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.SUPER_ADMIN;
            const isAssignedEmployee = req.user.id === task.employee_id;

            if (!isAdminOrSuperAdmin && !isAssignedEmployee) {
                return res.status(403).json({ message: "You don't have permission to view this task" });
            }

            return res.status(200).json({ task });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Update task status
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status || !Object.values(TASK_STATUS).includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            const task = await new TaskService().getOne({ where: { id } });

            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            // Check permissions
            const isAdminOrSuperAdmin = req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.SUPER_ADMIN;
            const isAssignedEmployee = req.user.id === task.employee_id;

            if (!isAdminOrSuperAdmin && !isAssignedEmployee) {
                return res.status(403).json({ message: "You don't have permission to update this task" });
            }

            const updatedTask = await new TaskService().update(id, { status });

            return res.status(200).json({ message: "Task status updated successfully", task: updatedTask });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Get tasks by status
    async getByStatus(req, res) {
        try {
            const { status } = req.params;

            if (!Object.values(TASK_STATUS).includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            const isAdminOrSuperAdmin = req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.SUPER_ADMIN;

            const whereClause = isAdminOrSuperAdmin
                ? { status }
                : { status, employee_id: req.user.id };

            const tasks = await new TaskService().getAll({
                where: whereClause,
                include: [
                    { model: db.user, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'email'] },
                    { model: db.user, as: 'admin', attributes: ['id', 'first_name', 'last_name', 'email'] },
                ],
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({ tasks });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Get tasks assigned to current user
    async getMyTasks(req, res) {
        try {
            const tasks = await new TaskService().getAll({
                where: { employee_id: req.user.id },
                include: [
                    { model: db.user, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'email'] },
                    { model: db.user, as: 'admin', attributes: ['id', 'first_name', 'last_name', 'email'] },
                ],
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({ tasks });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}


export default TaskController;
