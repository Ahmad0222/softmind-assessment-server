const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    changes: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskHistory', taskHistorySchema);