const express = require('express');
const router = express.Router();
const { generateProjectReport, getMyReports, getESGScorePreview } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Get all reports for logged-in investor
router.get('/', protect, getMyReports);

// Get ESG score preview for a project
router.get('/preview/:projectId', protect, getESGScorePreview);

// Generate ESG report for a project (investor only)
router.get('/project/:projectId', protect, generateProjectReport);

module.exports = router;
