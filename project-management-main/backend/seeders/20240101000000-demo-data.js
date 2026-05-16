const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminId = '11111111-1111-1111-1111-111111111111';
    const memberId1 = '22222222-2222-2222-2222-222222222222';
    const memberId2 = '33333333-3333-3333-3333-333333333333';
    const projectId1 = '44444444-4444-4444-4444-444444444444';
    const projectId2 = '55555555-5555-5555-5555-555555555555';

    // Users
    await queryInterface.bulkInsert('Users', [
      {
        id: adminId,
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: memberId1,
        name: 'shubham kumar',
        email: 'shubham@gmail.com',
        password: await bcrypt.hash('member123', 10),
        role: 'member',
        avatar: 'https://ui-avatars.com/api/?name=John&background=6366f1&color=fff',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: memberId2,
        name: 'shivam kumar',
        email: 'shivam@gmail.com',
        password: await bcrypt.hash('member123', 10),
        role: 'member',
        avatar: 'https://ui-avatars.com/api/?name=Jane&background=6366f1&color=fff',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Projects
    await queryInterface.bulkInsert('Projects', [
      {
        id: projectId1,
        name: 'Website Redesign',
        description: 'Complete redesign of company website with modern UI/UX',
        status: 'active',
        progress: 65,
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-05-31'),
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: projectId2,
        name: 'Mobile App Development',
        description: 'Build cross-platform mobile app for task management',
        status: 'active',
        progress: 30,
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-05-30'),
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Project Members
    await queryInterface.bulkInsert('ProjectMembers', [
      { ProjectId: projectId1, UserId: memberId1, createdAt: new Date(), updatedAt: new Date() },
      { ProjectId: projectId1, UserId: memberId2, createdAt: new Date(), updatedAt: new Date() },
      { ProjectId: projectId2, UserId: memberId1, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Tasks
    await queryInterface.bulkInsert('Tasks', [
      {
        id: '66666666-6666-6666-6666-666666666666',
        title: 'Design Homepage',
        description: 'Create modern homepage design with animations',
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2026-05-25'),
        assignedTo: memberId1,
        projectId: projectId1,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        title: 'Implement Authentication',
        description: 'Add JWT authentication with role-based access',
        status: 'in-progress',
        priority: 'urgent',
        dueDate: new Date('2026-05-28'),
        assignedTo: memberId1,
        projectId: projectId2,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        title: 'Create Dashboard UI',
        description: 'Build responsive dashboard with charts',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2026-05-10'),
        assignedTo: memberId2,
        projectId: projectId2,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '99999999-9999-9999-9999-999999999999',
        title: 'Fix Responsive Issues',
        description: 'Fix mobile responsiveness bugs',
        status: 'todo',
        priority: 'low',
        dueDate: new Date('2026-05-15'),
        assignedTo: memberId2,
        projectId: projectId1,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tasks', null, {});
    await queryInterface.bulkDelete('ProjectMembers', null, {});
    await queryInterface.bulkDelete('Projects', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};