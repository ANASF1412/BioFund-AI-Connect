const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProjectStatus,
    postProjectUpdate,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, authorize('NGO'), createProject);

router.route('/:id')
    .get(getProjectById);

router.route('/:id/status')
    .put(protect, authorize('Admin'), updateProjectStatus);

router.route('/:id/update')
    .post(protect, authorize('NGO'), postProjectUpdate);

module.exports = router;
