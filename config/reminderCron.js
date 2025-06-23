import cron from 'node-cron';
import Client from '../models/Client.js';
import { sendEmailAlert, sendOverdueAlert } from './emailService.js';
import { markReminderSent } from '../controllers/clientController.js';

// Run daily at 9:00 AM
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
        });

        const now = Date.now();
        const processing = [];

        clients.forEach(client => {
            const renewalDate = client.renewalDate.getTime();
            const daysRemaining = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));

            // Check reminder thresholds
            [90, 60, 30, 7].forEach(days => {
                if (daysRemaining <= days && daysRemaining > 0 && !client.remindersSent[days]) {
                    sendEmailAlert(client, days);
                    processing.push(markReminderSent(client._id, days));
                }
            });

            // Mark overdue
            if (daysRemaining < 0) {
                client.isOverdue = true;
                processing.push(client.save());
                sendOverdueAlert(client);
            }
        });

        await Promise.all(processing);
        console.log(`Processed ${clients.length} clients for reminders`);
    } catch (err) {
        console.error('Reminder job failed:', err);
    }
});