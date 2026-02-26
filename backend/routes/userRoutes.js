const express = require('express');
const router = express.Router();
const { getUsers, getPendingUsers, approveUser, rejectUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('Admin'), getUsers);
router.get('/pending', protect, authorize('Admin'), getPendingUsers);
router.put('/approve/:userId', protect, authorize('Admin'), approveUser);
router.put('/reject/:userId', protect, authorize('Admin'), rejectUser);

module.exports = router;
