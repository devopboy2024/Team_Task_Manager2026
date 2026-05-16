const { User, Project, Task, Activity } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const members = await User.findAll({
      where: { role: 'member' },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Task,
          as: 'assignedTasks',
          attributes: ['id', 'status'],
        },
      ],
    });

    const membersWithStats = members.map(member => ({
      ...member.toJSON(),
      stats: {
        totalTasks: member.assignedTasks.length,
        completedTasks: member.assignedTasks.filter(t => t.status === 'completed').length,
        inProgressTasks: member.assignedTasks.filter(t => t.status === 'in-progress').length,
      },
    }));

    res.json(membersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(req.body);

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
      limit: 20,
      order: [['createdAt', 'DESC']],
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};