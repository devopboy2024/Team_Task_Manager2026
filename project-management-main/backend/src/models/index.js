const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.url, config);

const User = require('./User')(sequelize);
const Project = require('./Project')(sequelize);
const Task = require('./Task')(sequelize);
const Activity = require('./Activity')(sequelize);
const Notification = require('./Notification')(sequelize);

// Associations
User.hasMany(Project, { as: 'createdProjects', foreignKey: 'createdBy' });
Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

User.belongsToMany(Project, { through: 'ProjectMembers', as: 'projects' });
Project.belongsToMany(User, { through: 'ProjectMembers', as: 'members' });

User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assignedTo' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });

Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Activity, { as: 'activities', foreignKey: 'userId' });
Activity.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { as: 'notifications', foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  Activity,
  Notification,
};