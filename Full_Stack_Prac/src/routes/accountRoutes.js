const express = require('express');
const validate = require('../middleware/validate');
const accountController = require('../controller/accountController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  openAccountSchema,
  amountSchema,
  transferSchema,
} = require('../validation/accountSchemas');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin'), accountController.getAllAccounts);
router.get('/me', accountController.getMyAccounts);
router.get('/:accountId', accountController.getAccountById);
router.post('/open', validate(openAccountSchema), accountController.openAccount);
router.post('/:accountId/deposit', validate(amountSchema), accountController.deposit);
router.post('/:accountId/withdraw', validate(amountSchema), accountController.withdraw);
router.post('/transfer', validate(transferSchema), accountController.transfer);

module.exports = router;
