import Client from '../models/Client.js';
import LicenseType from '../models/LicenseType.js';
import fs from 'fs';
import path from 'path';

export const handleWebhook = async (req, res) => {
    try {
        const payload = req.body;

        // Log the full payload
        const logDir = path.resolve('/var/www/softmind-assessment-server/webhook_logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logFile = path.join(logDir, `webhook_${Date.now()}.json`);
        fs.writeFileSync(logFile, JSON.stringify(payload, null, 2));

        // Check renewal opt-in
        const renewalOptIn = payload["Have us handle renewals for you at 50% off your licensing price. Charged 1 month before renewal is due."];
        console.log(renewalOptIn)
        if (!renewalOptIn || renewalOptIn.toLowerCase() !== "yes") {
            return res.status(200).json({ message: 'Opt-out of renewal handling, no action taken.' });
        }

        // Build dynamic client object only with existing fields
        const clientData = {
            source: 'webhook',
            jurisdiction: {}
        };

        if (payload.full_name) clientData.clientName = payload.full_name;
        else if (payload.first_name || payload.last_name)
            clientData.clientName = `${payload.first_name || ''} ${payload.last_name || ''}`.trim();

        if (payload.email) clientData.contactEmail = payload.email;
        if (payload["Business Name"]) clientData.businessName = payload["Business Name"];
        if (payload["EIN #"]) clientData.ein = payload["EIN #"];
        if (payload["Full Address"]) clientData.strPropertyAddress = payload["Full Address"];
        else if (payload["Vacation Rental Property Address"]) clientData.strPropertyAddress = payload["Vacation Rental Property Address"];
        else clientData.strPropertyAddress = payload.full_address

        if (payload["Any Other Notes We Should Know?"]) clientData.notes = payload["Any Other Notes We Should Know?"];
        else if (payload["Message"]) clientData.notes = payload["Message"];

        // Fill jurisdiction if present
        if (payload.state) clientData.jurisdiction.state = payload.state;
        if (payload.county) clientData.jurisdiction.county = payload.county;
        if (payload.city) clientData.jurisdiction.city = payload.city;
        if (payload.postal_code) clientData.jurisdiction.postalCode = payload.postal_code;


        if (Array.isArray(payload["What license/docs do you currently have (if any)"])) {
            clientData.existingLicenses = payload["What license/docs do you currently have (if any)"];
        }

        const newClient = await Client.create(clientData);

        return res.status(201).json({ message: 'Client created from webhook', client: newClient });
    } catch (err) {
        console.error('Webhook error:', err);
        return res.status(500).json({ error: err.message });
    }
};