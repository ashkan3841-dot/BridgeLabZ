const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const transactionController = require('../controller/transactionController');

const router = express.Router();
router.use(authenticate);

router.get('/', transactionController.getUserTransactions);
router.get('/account/:accountId', transactionController.getAccountTransactions);

module.exports = router;
