const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorizeFeature } = require('../middleware/auth.middleware');

// Protect all routes with authentication middleware
router.use(protect);

router.get('/me', userController.getMe);
router.get('/', authorizeFeature('canManageUsers'), userController.getUsers);
router.post('/', authorizeFeature('canManageUsers'), userController.createUser);
router.put('/:id', authorizeFeature('canManageUsers'), userController.updateUser);
router.delete('/:id', authorizeFeature('canManageUsers'), userController.deleteUser);

module.exports = router;
