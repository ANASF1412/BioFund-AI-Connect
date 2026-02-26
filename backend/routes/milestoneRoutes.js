const express = require('express');
const router = express.Router();
const {
    getMilestonesByProject,
    createMilestone,
    updateMilestone,
} = require('../controllers/milestoneController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/:projectId')
    .get(getMilestonesByProject);

router.route('/')
    .post(protect, authorize('NGO'), createMilestone);

router.route('/:id')
    .put(protect, authorize('Admin'), updateMilestone);

module.exports = router;
