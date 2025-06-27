import nodemailer from 'nodemailer';

// Create reusable transporter object
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendEmailAlert = (client, daysOut, license) => {
    const renewalDate = new Date(license.renewalDate).toDateString();
    const urgencyColor = daysOut <= 7 ? '#dc2626' : daysOut <= 14 ? '#f59e0b' : '#10b981';
    const urgencyText = daysOut <= 7 ? 'URGENT' : daysOut <= 14 ? 'APPROACHING' : 'UPCOMING';

    const mailOptions = {
        from: `"Renewal Tracker" <${process.env.EMAIL_FROM}>`,
        to: client.assignedTo?.email || process.env.DEFAULT_ALERT_EMAIL,
        subject: `Renewal Due in ${daysOut} Days: ${client.clientName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0; font-family: 'Poppins', Arial, sans-serif; background-color: #f7f9fc;">
          <!-- Main Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 30px auto; background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%); padding: 30px 40px; text-align: center;">
                <table width="100%">
                  <tr>
                    <td style="text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Renewal Alert</h1>
                      <div style="background: ${urgencyColor}; display: inline-block; padding: 6px 20px; border-radius: 50px; margin: 15px 0; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
                        ${urgencyText} • ${daysOut} DAYS REMAINING
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Client Info -->
            <tr>
              <td style="padding: 30px 40px;">
                <table width="100%">
                  <tr>
                    <td>
                      <h2 style="color: #1e293b; margin: 0 0 10px; font-size: 22px; font-weight: 600;">
                        ${client.clientName}
                        ${client.businessName ? `<span style="display: block; font-size: 16px; color: #64748b; font-weight: 400; margin-top: 5px;">${client.businessName}</span>` : ''}
                      </h2>
                      
                      <div style="display: flex; align-items: center; margin: 15px 0;">
                        <div>
                          <div style="font-size: 14px; color: #64748b; font-weight: 500;">Contact Email</div>
                          <div style="font-size: 16px; font-weight: 500;">${client.contactEmail}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- License Details -->
            <tr>
              <td style="padding: 0 40px 30px;">
                <div style="background: #f8fafc; border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0;">
                  <h3 style="margin: 0 0 20px; font-size: 18px; color: #1e293b; font-weight: 600; display: flex; align-items: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V13H5V6.3L12 3.19V11.99Z" fill="#4361ee"/>
                    </svg>
                    License Details
                  </h3>
                  
                  <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                    <div style="flex: 1; min-width: 200px;">
                      <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">License Type</div>
                      <div style="font-size: 16px; font-weight: 500;">${license.licenseType.name}</div>
                    </div>
                    
                    <div style="flex: 1; min-width: 200px;">
                      <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Jurisdiction</div>
                      <div style="font-size: 16px; font-weight: 500;">
                        ${license.jurisdiction.state}, ${license.jurisdiction.county}, ${license.jurisdiction.city}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Renewal Date -->
            <tr>
              <td style="padding: 0 40px 30px;">
                <div style="display: flex; flex-wrap: wrap; gap: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; padding: 25px; border: 1px solid #bae6fd;">
                  <div style="flex: 1; min-width: 200px; text-align: center;">
                    <div style="font-size: 14px; color: #0369a1; margin-bottom: 10px; font-weight: 500;">RENEWAL DATE</div>
                    <div style="font-size: 22px; font-weight: 700; color: #0c4a6e;">${renewalDate}</div>
                  </div>
                  
                  <div style="flex: 1; min-width: 200px; text-align: center;">
                    <div style="font-size: 14px; color: #0369a1; margin-bottom: 10px; font-weight: 500;">DAYS REMAINING</div>
                    <div style="font-size: 48px; font-weight: 700; color: ${urgencyColor}; line-height: 1;">${daysOut}</div>
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 25px 40px; background: #f1f5f9; text-align: center; color: #64748b; font-size: 13px;">
                <p style="margin: 0 0 10px;">This is an automated alert from Renewal Tracker System</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending reminder for ${client.clientName}:`, error);
        } else {
            console.log(`Reminder email sent for ${client.clientName}: ${info.response}`);
        }
    });
};


export const sendOverdueAlert = (client, license) => {
    const renewalDate = new Date(license.renewalDate);
    const daysOverdue = Math.ceil((Date.now() - renewalDate.getTime()) / (1000 * 60 * 60 * 24));

    const mailOptions = {
        from: `"Renewal Tracker" <${process.env.EMAIL_FROM}>`,
        to: process.env.INTERNAL_TEAM_EMAIL,
        subject: `URGENT: License Overdue for ${client.clientName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          </style>
        </head>
        <body style="margin:0; padding:0; font-family: 'Poppins', Arial, sans-serif; background-color: #fff5f5;">
          <!-- Main Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 30px auto; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(220, 38, 38, 0.15); overflow: hidden; border-top: 6px solid #dc2626;">
            <!-- Urgent Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                  LICENSE OVERDUE
                </h1>
                <div style="color: rgba(255,255,255,0.85); font-size: 18px; margin-top: 10px;">
                  ${daysOverdue} DAYS PAST DUE
                </div>
              </td>
            </tr>
            
            <!-- Client Info -->
            <tr>
              <td style="padding: 30px 40px 20px;">
                <h2 style="color: #1e293b; margin: 0 0 5px; font-size: 24px; font-weight: 700;">
                  ${client.clientName}
                </h2>
                ${client.businessName ? `<div style="color: #64748b; font-size: 18px; margin-bottom: 25px;">${client.businessName}</div>` : ''}
                
                <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                  <div style="font-size: 16px; color: #b91c1c; font-weight: 600; margin-bottom: 10px;">⚠️ IMMEDIATE ATTENTION REQUIRED</div>
                  <div style="font-size: 15px; color: #7f1d1d;">This license renewal is now overdue. Penalties may apply if not renewed immediately.</div>
                </div>
              </td>
            </tr>
            
            <!-- Details Section -->
            <tr>
              <td style="padding: 0 40px;">
                <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px;">
                  <!-- Client Column -->
                  <div style="flex: 1; min-width: 250px;">
                    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
                      <h3 style="margin: 0 0 15px; font-size: 18px; color: #1e293b; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9;">
                        CLIENT INFORMATION
                      </h3>
                      
                      <div style="margin-bottom: 15px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Contact Email</div>
                        <div style="font-size: 16px; font-weight: 500;">${client.contactEmail || 'N/A'}</div>
                      </div>
                      
                      <div style="margin-bottom: 15px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Assigned To</div>
                        <div style="font-size: 16px; font-weight: 500;">${client.assignedTo?.name || 'Unassigned'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- License Column -->
                  <div style="flex: 1; min-width: 250px;">
                    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
                      <h3 style="margin: 0 0 15px; font-size: 18px; color: #1e293b; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9;">
                        LICENSE DETAILS
                      </h3>
                      
                      <div style="margin-bottom: 15px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">License Type</div>
                        <div style="font-size: 16px; font-weight: 500;">${license.licenseType.name || 'N/A'}</div>
                      </div>
                      
                      <div style="margin-bottom: 15px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Jurisdiction</div>
                        <div style="font-size: 16px; font-weight: 500;">
                          ${license.jurisdiction.state}, ${license.jurisdiction.county}, ${license.jurisdiction.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Critical Dates -->
            <tr>
              <td style="padding: 0 40px 30px;">
                <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                  <div style="flex: 1; min-width: 200px; background: #fff7ed; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #ffedd5;">
                    <div style="font-size: 14px; color: #ea580c; margin-bottom: 10px; font-weight: 600;">RENEWAL DATE</div>
                    <div style="font-size: 20px; font-weight: 700; color: #9a3412;">${renewalDate.toDateString()}</div>
                  </div>
                  
                  <div style="flex: 1; min-width: 200px; background: #fef2f2; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #fee2e2;">
                    <div style="font-size: 14px; color: #dc2626; margin-bottom: 10px; font-weight: 600;">DAYS OVERDUE</div>
                    <div style="font-size: 42px; font-weight: 800; color: #b91c1c; line-height: 1;">${daysOverdue}</div>
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 25px 40px; background: #fef2f2; text-align: center; color: #b91c1c; font-size: 13px; border-top: 1px solid #fee2e2;">
                <p style="margin: 0 0 10px; font-weight: 600;">CRITICAL ACTION REQUIRED</p>
                <p style="margin: 0; font-size: 12px; color: #7f1d1d;">This is an automated alert from Renewal Tracker System • Sent to internal team</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error(`Overdue email failed for ${client.clientName}:`, error);
        } else {
            console.log(`Overdue email sent for ${client.clientName}`);
        }
    });
};

