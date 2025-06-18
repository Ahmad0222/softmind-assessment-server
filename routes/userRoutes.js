const express = require('express');
const {
    getUsers,
    updateUserRole } = require('../controllers/userController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

// Admin only routes
router.use(auth(['admin']));

router.route('/')
    .get(getUsers);

router.route('/:id')
    .put(updateUserRole);

module.exports = router;