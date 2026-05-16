const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getTasks);
router.get('/dashboard/stats', getDashboardStats);
router.get('/:id', getTaskById);
router.post('/', admin, createTask);
router.put('/:id', updateTask);
router.delete('/:id', admin, deleteTask);

module.exports = router;