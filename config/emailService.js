import nodemailer from 'nodemailer';

// Create reusable transporter object
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send reminder email
export const sendEmailAlert = (client, daysOut) => {
    const mailOptions = {
        from: `"Renewal Tracker" <${process.env.EMAIL_FROM}>`,
        to: process.env.INTERNAL_TEAM_EMAIL,
        subject: `Renewal Due in ${daysOut} Days: ${client.clientName}`,
        text: `Renewal Alert!
    
Client: ${client.clientName}
Email: ${client.contactEmail}
License Type: ${client.licenseType}
Jurisdiction: ${client.jurisdiction.state}, ${client.jurisdiction.county}, ${client.jurisdiction.city}
Renewal Date: ${client.renewalDate.toDateString()}
Days Remaining: ${daysOut}

Please take appropriate action.
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending email for ${client.clientName}:`, error);
        } else {
            console.log(`Email sent for ${client.clientName}: ${info.response}`);
        }
    });
};

// Send overdue alert
export const sendOverdueAlert = (client) => {
    const mailOptions = {
        from: `"Renewal Tracker" <${process.env.EMAIL_FROM}>`,
        to: process.env.INTERNAL_TEAM_EMAIL,
        subject: `URGENT: License Overdue for ${client.clientName}`,
        text: `OVERDUE ALERT!

Client: ${client.clientName}
Email: ${client.contactEmail}
License Type: ${client.licenseType}
Jurisdiction: ${client.jurisdiction.state}, ${client.jurisdiction.county}, ${client.jurisdiction.city}
Renewal Date: ${client.renewalDate.toDateString()}
Days Overdue: ${Math.ceil((Date.now() - client.renewalDate) / (1000 * 60 * 60 * 24))}

Immediate action required!
`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) console.error(`Overdue email failed for ${client.clientName}:`, error);
    });
};


export const sendTestEmail = async (to, subject, text) => {
    const mailOptions = {
        from: `"Test Email" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Test email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}