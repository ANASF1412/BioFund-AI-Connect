const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getTransactions)
    .post(protect, authorize('Investor'), createTransaction);

module.exports = router;
