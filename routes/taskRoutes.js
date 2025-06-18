const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const taskController = require('../controllers/taskController');

router.post('/',
    auth(['admin', 'manager']),
    upload.array('attachments', 3),
    taskController.createTask
);

router.get('/', auth(), taskController.getTasks);
router.get('/:id', auth(), taskController.getTaskById);
router.get('/:id/history', auth(), taskController.getTaskHistory);

router.patch('/:id',
    auth(),
    upload.array('attachments', 3),
    taskController.updateTask
);

// Add other CRUD routes

module.exports = router;