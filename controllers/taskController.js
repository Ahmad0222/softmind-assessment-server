const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');

// Create task with history tracking
exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            attachments: req.files?.map(file => ({
                filename: file.filename,
                path: file.path
            }))
        });

        await task.save();

        // Track creation history
        await TaskHistory.create({
            taskId: task._id,
            changedBy: req.user.id,
            changes: { action: 'created', details: req.body }
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update task with history tracking
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const oldTask = { ...task.toObject() };
        const updates = Object.keys(req.body);

        updates.forEach(update => task[update] = req.body[update]);

        if (req.files) {
            req.files.forEach(file => {
                task.attachments.push({
                    filename: file.filename,
                    path: file.path
                });
            });
        }

        await task.save();

        // Track changes
        const changes = {};
        updates.forEach(update => {
            if (oldTask[update] !== task[update]) {
                changes[update] = {
                    from: oldTask[update],
                    to: task[update]
                };
            }
        });

        if (Object.keys(changes).length > 0) {
            await TaskHistory.create({
                taskId: task._id,
                changedBy: req.user.id,
                changes
            });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTaskHistory = async (req, res) => {
    try {
        const history = await TaskHistory.find({ taskId: req.params.id })
            .populate('changedBy', 'name email')
            .sort({ timestamp: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};