const { Project, User, Task, Activity } = require('../models');
const { Op } = require('sequelize');

exports.getProjects = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    if (status) {
      where.status = status;
    }

    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.findAll({
        where,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
        ],
        order: [['createdAt', 'DESC']],
      });
    } else {
      projects = await Project.findAll({
        where,
        include: [
          { model: User, as: 'members', where: { id: req.user.id }, required: true },
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        ],
        order: [['createdAt', 'DESC']],
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email', 'avatar'], through: { attributes: [] } },
        { model: Task, include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar'] }] },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    if (req.user.role !== 'admin') {
      const isMember = await project.hasMember(req.user.id);
      if (!isMember) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, memberIds = [] } = req.body;

    const project = await Project.create({
      name,
      description,
      startDate,
      endDate,
      createdBy: req.user.id,
    });

    // Add members
    if (memberIds.length > 0) {
      await project.addMembers(memberIds);
    }

    await Activity.create({
      action: 'Project Created',
      details: { projectId: project.id, projectName: project.name },
      userId: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await project.update(req.body);

    await Activity.create({
      action: 'Project Updated',
      details: { projectId: project.id, projectName: project.name },
      userId: req.user.id,
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await project.destroy();

    await Activity.create({
      action: 'Project Deleted',
      details: { projectId: project.id, projectName: project.name },
      userId: req.user.id,
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await project.addMember(user);

    res.json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await project.removeMember(userId);

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};