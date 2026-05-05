const express = require('express');
const validate = require('../middleware/validate');
const authController = require('../controller/authController');
const { registerSchema, loginSchema, refreshSchema } = require('../validation/authSchemas');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refreshToken);
router.post('/logout', validate(refreshSchema), authController.logout);

module.exports = router;
