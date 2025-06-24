import Client from '../models/Client.js';
import LicenseType from '../models/LicenseType.js';

// Create new client (manual entry)
export const createClient = async (req, res) => {
    try {
        // Validate license type
        // const licenseType = await LicenseType.findById(req.body.licenseType);
        // if (!licenseType) {
        //     return res.status(400).json({ error: 'Invalid license type' });
        // }

        const newClient = await Client.create(req.body);
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update client
export const updateClient = async (req, res) => {
    try {
        // Validate license type if being updated
        if (req.body.licenseType) {
            const licenseType = await LicenseType.findById(req.body.licenseType);
            if (!licenseType) {
                return res.status(400).json({ error: 'Invalid license type' });
            }
        }

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('licenseType assignedTo', 'name email');

        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all clients with filtering (now with assignment)
export const getClients = async (req, res) => {
    try {
        const { status, jurisdiction, sort, assignedTo } = req.query;

        const filter = {};
        if (status === 'overdue') filter.isOverdue = true;
        if (jurisdiction) filter['jurisdiction.state'] = jurisdiction;
        if (assignedTo) filter.assignedTo = assignedTo;

        const sortOptions = {};
        if (sort === 'renewalDate') sortOptions.renewalDate = 1;

        const clients = await Client.find(filter)
            .sort(sortOptions)
            .populate('assignedTo', 'name email')
            .populate('licenses.licenseType', 'name description');

        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Mark reminders as sent
export const markReminderSent = async (clientId, daysOut) => {
    await Client.findByIdAndUpdate(clientId, {
        $set: { [`remindersSent.${daysOut}`]: true }
    });
};