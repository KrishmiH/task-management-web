const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/tasks', reportController.generateTaskReport);

module.exports = router;
