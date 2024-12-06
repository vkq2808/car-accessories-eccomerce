const express = require('express');
import db from '../models';


const applyTaskRoute = (app) => {
  const router = express.Router();

  // Fetch all tasks (Admin)
  router.get('/', async (req, res) => {
    try {
      const tasks = await db.task.findAll({
        include: { model: db.user, as: 'employee', attributes: ['id', 'first_name', 'last_name'] }
      });
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      res.status(500).json({ message: 'Không lấy được nhiệm vụ', error: error.message });
    }
  });

  // Fetch tasks assigned to a specific employee
  router.get('/employee/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const tasks = await db.task.findAll({
        where: { assignedTo: id },
        include: { model: db.user, as: 'employee', attributes: ['id', 'first_name', 'last_name'] }
      });
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks for employee:", error);
      res.status(500).json({ message: 'Không lấy được nhiệm vụ cho nhân viên', error: error.message });
    }
  });

  // Fetch a single task by ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const task = await db.task.findByPk(id, {
        include: { model: db.user, as: 'employee', attributes: ['id', 'first_name', 'last_name'] }
      });
      if (!task) {
        return res.status(404).json({ message: 'db.task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task details:", error);
      res.status(500).json({ message: 'Error fetching task details', error: error.message });
    }
  });

  // Add a new task
  router.post('/', async (req, res) => {
    const { title, description, assignedTo, dueDate } = req.body;
    try {
      const task = await db.task.create({ title, description, assignedTo, dueDate });
      res.status(201).json({ message: 'Nhiệm vụ mới đã được thêm', task });
    } catch (error) {
      console.error("Error adding new task:", error);
      res.status(400).json({ message: 'Thêm nhiệm vụ thất bại', error: error.message });
    }
  });

  // Update task details
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, assignedTo, dueDate } = req.body;

    try {
      const task = await db.task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: 'Nhiệm vụ không tồn tại' });
      }

      // Update task fields
      task.title = title || task.title;
      task.description = description || task.description;
      task.assignedTo = assignedTo || task.assignedTo;
      task.dueDate = dueDate || task.dueDate;

      await task.save();
      res.json({ message: 'Cập nhật nhiệm vụ thành công', task });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: 'Không thể cập nhật nhiệm vụ', error: error.message });
    }
  });

  // Update task status
  router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const task = await db.task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: 'Nhiệm vụ không tồn tại' });
      }

      task.status = status;
      await task.save();

      res.json({ message: 'Cập nhật trạng thái thành công', task });
    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ message: 'Không thể cập nhật trạng thái', error: error.message });
    }
  });

  // Delete a task
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const task = await db.task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: 'Nhiệm vụ không tồn tại' });
      }

      await task.destroy();
      res.json({ message: 'Xóa nhiệm vụ thành công' });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: 'Không thể xóa nhiệm vụ', error: error.message });
    }
  });

  app.use('/api/v1/tasks', router);
}

export default applyTaskRoute;