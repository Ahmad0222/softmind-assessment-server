const express = require('express');
const auth = require('../middleware/auth.js');
const {
    registerUser,
    loginUser,
    refreshToken,
    getCurrentUser
} = require('../controllers/authController.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth(), getCurrentUser);
router.post('/refresh-token', refreshToken);

module.exports = router;