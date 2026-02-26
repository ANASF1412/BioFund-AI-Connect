const express = require('express');
const router = express.Router();
const {
    createFunding,
    getMyInvestments,
    getProjectFundings,
} = require('../controllers/fundingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Create funding - Investor only
router.post('/', protect, authorize('Investor'), createFunding);

// Get my investments
router.get('/my-investments', protect, authorize('Investor'), getMyInvestments);

// Get fundings for a specific project
router.get('/project/:projectId', getProjectFundings);

module.exports = router;
