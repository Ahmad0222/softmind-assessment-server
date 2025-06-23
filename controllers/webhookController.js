import Client from '../models/Client.js';
import LicenseType from '../models/LicenseType.js';

export const handleWebhook = async (req, res) => {
    try {
        const payload = req.body;

        // Validate required fields
        if (!payload.contactEmail || !payload.renewalDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find license type by name
        let licenseType;
        if (payload.licenseTypeName) {
            licenseType = await LicenseType.findOne({ name: payload.licenseTypeName });
        }

        // Use default license type if not found
        if (!licenseType) {
            licenseType = await LicenseType.findOne({ name: 'General' });
            if (!licenseType) {
                // Create a default if doesn't exist
                licenseType = await LicenseType.create({
                    name: 'General',
                    description: 'Default license type'
                });
            }
        }

        // Create new client from webhook
        const newClient = await Client.create({
            clientName: payload.fullName || payload.clientName || 'Unknown',
            contactEmail: payload.contactEmail,
            licenseType: licenseType._id,
            renewalDate: new Date(payload.renewalDate),
            jurisdiction: {
                state: payload.state,
                county: payload.county,
                city: payload.city,
            },
            source: 'webhook',
        });

        res.status(201).json(newClient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};