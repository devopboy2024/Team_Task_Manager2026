const express = require('express');
const {
  getUsers,
  getTeamMembers,
  updateUser,
  deleteUser,
  getActivities,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', admin, getUsers);
router.get('/members', admin, getTeamMembers);
router.get('/activities', getActivities);
router.put('/:id', updateUser);
router.delete('/:id', admin, deleteUser);

module.exports = router;