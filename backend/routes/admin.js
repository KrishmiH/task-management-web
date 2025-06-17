const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');

// Protect routes and restrict to admin only
router.use(authMiddleware, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
});

// List users
router.get('/users', adminController.getAllUsers);

// Edit user
router.put('/users/:id', adminController.updateUser);

// Soft delete user
router.delete('/users/:id', adminController.softDeleteUser);

module.exports = router;
