import cron from 'node-cron';
import Client from '../models/Client.js';
import { sendEmailAlert, sendOverdueAlert } from './emailService.js';
import { markReminderSent } from '../controllers/clientController.js';

// Every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
    console.log('Running daily renewal check...');

    try {
        const clients = await Client.find({
            isOverdue: false,
            $or: [
                { 'remindersSent.90': false },
                { 'remindersSent.60': false },
                { 'remindersSent.30': false },
                { 'remindersSent.7': false },
            ]
        }).populate('assignedTo', 'name email').populate('licenses.licenseType', 'name description');

        const now = Date.now();
        const thresholds = [90, 60, 30, 7];
        const processing = [];

        for (const client of clients) {
            let clientNeedsUpdate = false;
            let anyLicenseOverdue = false;

            for (const license of client.licenses) {
                const renewalDate = new Date(license.renewalDate).getTime();
                const daysRemaining = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));

                console.log(`Client ${client.clientName} - License Renewal in ${daysRemaining} days`);

                // Loop through thresholds and send reminders if not already sent
                for (const days of thresholds) {
                    if (
                        daysRemaining <= days &&
                        daysRemaining > 0 &&
                        !client.remindersSent[days]
                    ) {
                        await sendEmailAlert(client, daysRemaining, license); // pass license if needed in email
                        processing.push(markReminderSent(client._id, days));
                        clientNeedsUpdate = true;
                        break; // Only send one reminder per run per client
                    }
                }

                if (daysRemaining < 0) {
                    anyLicenseOverdue = true;
                }
            }

            if (anyLicenseOverdue) {
                client.isOverdue = true;
                processing.push(client.save());
                await sendOverdueAlert(client);
            } else if (clientNeedsUpdate) {
                await client.save();
            }
        }

        await Promise.all(processing);
        console.log(`Processed ${clients.length} clients for reminders`);
    } catch (err) {
        console.error('Reminder job failed:', err);
    }
});
