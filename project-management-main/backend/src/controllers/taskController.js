const { Task, Project, User, Activity, Notification } = require('../models');
const { Op } = require('sequelize');

exports.getTasks = async (req, res) => {
  try {
    const { search, status, priority, projectId, page = 1, limit = 10 } = req.query;
    const where = {};

    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (projectId) {
      where.projectId = projectId;
    }

    if (req.user.role !== 'admin') {
      where.assignedTo = req.user.id;
    }

    const offset = (page - 1) * limit;
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email', 'avatar'] },
        { model: Project, attributes: ['id', 'name'] },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dueDate', 'ASC']],
    });

    res.json({
      tasks,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email', 'avatar'] },
        { model: Project, attributes: ['id', 'name'] },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      priority,
      dueDate,
      createdBy: req.user.id,
      status: 'todo',
    });

    // Create notification for assignee
    if (assignedTo !== req.user.id) {
      await Notification.create({
        title: 'Task Assigned',
        message: `You have been assigned a new task: ${title}`,
        type: 'task_assigned',
        userId: assignedTo,
      });
    }

    await Activity.create({
      action: 'Task Created',
      details: { taskId: task.id, taskTitle: task.title },
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const oldStatus = task.status;
    await task.update(req.body);

    // Send notification for status change
    if (req.body.status && oldStatus !== req.body.status && req.user.role === 'admin') {
      await Notification.create({
        title: 'Task Status Updated',
        message: `Task "${task.title}" status changed to ${req.body.status}`,
        type: 'task_completed',
        userId: task.assignedTo,
      });
    }

    await Activity.create({
      action: 'Task Updated',
      details: { taskId: task.id, taskTitle: task.title },
      userId: req.user.id,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await task.destroy();

    await Activity.create({
      action: 'Task Deleted',
      details: { taskId: task.id, taskTitle: task.title },
      userId: req.user.id,
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { assignedTo: req.user.id };
    
    const totalTasks = await Task.count({ where });
    const completedTasks = await Task.count({ where: { ...where, status: 'completed' } });
    const inProgressTasks = await Task.count({ where: { ...where, status: 'in-progress' } });
    const todoTasks = await Task.count({ where: { ...where, status: 'todo' } });
    
    const overdueTasks = await Task.count({
      where: {
        ...where,
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'completed' },
      },
    });

    // Tasks by priority
    const lowPriority = await Task.count({ where: { ...where, priority: 'low' } });
    const mediumPriority = await Task.count({ where: { ...where, priority: 'medium' } });
    const highPriority = await Task.count({ where: { ...where, priority: 'high' } });
    const urgentPriority = await Task.count({ where: { ...where, priority: 'urgent' } });

    // Recent tasks
    const recentTasks = await Task.findAll({
      where,
      include: [{ model: Project, attributes: ['name'] }],
      limit: 5,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      priorityBreakdown: { low: lowPriority, medium: mediumPriority, high: highPriority, urgent: urgentPriority },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};