import nodemailer from 'nodemailer';

// Helper to create nodemailer transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null; // SMTP not configured yet
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

/**
 * 1. Send Admin Notification Email when new lead/quote is submitted
 */
export async function sendAdminLeadNotification(lead) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const fromEmail = process.env.EMAIL_FROM || '"ASTTORIA Inquiries" <no-reply@asttoria.com>';

  const transporter = getTransporter();

  const formattedDate = new Date(lead.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const productsList = Array.isArray(lead.products_required) && lead.products_required.length > 0
    ? lead.products_required.map(p => `<li style="margin-bottom: 4px; color: #0A4FAF; font-weight: 600;">${p}</li>`).join('')
    : '<li style="color: #6B7280;">General Building Solutions</li>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Lead Inquiry - ASTTORIA</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; margin: 0; padding: 24px; color: #111827;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="background-color: #0B1220; padding: 28px 32px; border-bottom: 3px solid #0A4FAF;">
          <div style="color: #7BA7E8; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; font-weight: 700;">ASTTORIA · Customer Lead Alert</div>
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 8px 0 0 0;">New Quotation Inquiry Received</h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="font-size: 15px; line-height: 1.5; color: #374151; margin-top: 0;">
            A customer has submitted a new inquiry through the website quote form on <strong>${formattedDate}</strong>:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 10px 0; color: #6B7280; width: 140px; font-weight: 600;">Customer Name:</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 700;">${lead.full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Company / Org:</td>
              <td style="padding: 10px 0; color: #111827;">${lead.company_name || 'Individual Client'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Phone Number:</td>
              <td style="padding: 10px 0;"><a href="tel:${lead.phone}" style="color: #0A4FAF; text-decoration: none; font-weight: 700;">${lead.phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Email Address:</td>
              <td style="padding: 10px 0;"><a href="mailto:${lead.email}" style="color: #0A4FAF; text-decoration: none;">${lead.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Project Location:</td>
              <td style="padding: 10px 0; color: #111827;">${lead.project_location || 'Not Specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Quantity Needed:</td>
              <td style="padding: 10px 0; color: #111827;">${lead.quantity_required || 'Not Specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Contact Method:</td>
              <td style="padding: 10px 0; color: #111827;">${lead.contact_method || 'Phone'}</td>
            </tr>
          </table>

          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; font-weight: 700; margin-bottom: 8px;">Products Requested:</div>
            <ul style="margin: 0; padding-left: 20px;">
              ${productsList}
            </ul>
          </div>

          ${lead.additional_requirements ? `
          <div style="background-color: #EFF6FF; border-left: 4px solid #0A4FAF; padding: 14px 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #0A4FAF; font-weight: 700; margin-bottom: 6px;">Client Message / Specifications:</div>
            <p style="margin: 0; color: #1E3A8A; font-size: 13px; line-height: 1.5; white-space: pre-line;">${lead.additional_requirements}</p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:5173/admin" style="display: inline-block; background-color: #0A4FAF; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 4px;">
              Open Admin Dashboard to Respond
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 16px 32px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #9CA3AF;">
          ASTTORIA · Certified Ceiling & Partition Systems · Established 1996
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter || !adminEmail) {
    console.log(`[Email Notification Simulated] SMTP or ADMIN_NOTIFICATION_EMAIL not set.`);
    console.log(`[Lead Preview] Name: ${lead.full_name}, Phone: ${lead.phone}, Email: ${lead.email}`);
    return {
      success: true,
      simulated: true,
      message: 'SMTP credentials not configured in server/.env — Lead recorded and notification simulated in console.'
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: `🔔 New Lead Inquiry: ${lead.full_name} (${lead.phone})`,
      html: htmlContent
    });
    console.log('Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Send Customer Reply Email from Admin using fixed professional template
 */
export async function sendCustomerReplyEmail(lead, { subject, message }) {
  const fromEmail = process.env.EMAIL_FROM || '"ASTTORIA Building Solutions" <contact@asttoria.com>';
  const transporter = getTransporter();

  const formattedMessage = message
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(p => `<p style="margin: 0 0 14px 0; line-height: 1.6; color: #374151; font-size: 15px;">${p}</p>`)
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
      <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="background-color: #0B1220; padding: 32px 36px; border-bottom: 3px solid #0A4FAF;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="color: #7BA7E8; text-transform: uppercase; letter-spacing: 2.5px; font-size: 11px; font-weight: 800;">ASTTORIA</div>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 6px 0 0 0; letter-spacing: -0.5px;">Industrial & Commercial Solutions</h1>
            </div>
          </div>
        </div>

        <!-- Reference bar -->
        <div style="background-color: #F1F5F9; border-bottom: 1px solid #E2E8F0; padding: 12px 36px; font-size: 12px; color: #475569;">
          <strong>Inquiry Reference:</strong> ${lead.products_required?.join(', ') || 'Building Materials & Ceiling Systems'} · 
          <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        <!-- Body -->
        <div style="padding: 36px;">
          <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #0B1220;">
            Dear ${lead.full_name},
          </p>

          <div style="margin: 20px 0;">
            ${formattedMessage}
          </div>

          <!-- Contact Card -->
          <div style="margin-top: 36px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0A4FAF; margin-bottom: 10px;">
              ASTTORIA Support & Quotation Team
            </div>
            <div style="font-size: 13px; color: #475569; line-height: 1.6;">
              📞 <strong>Direct Desk:</strong> +91 98888 00000 / +91 172 000000<br>
              ✉️ <strong>Official Email:</strong> contact@asttoria.com<br>
              📍 <strong>Head Office & Warehouse:</strong> Industrial Area, Phase 9, Mohali, Punjab, India<br>
              🌐 <strong>Online Catalogue:</strong> <a href="https://asttoria.com" style="color: #0A4FAF; text-decoration: none;">asttoria.com</a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0B1220; padding: 20px 36px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #1E293B;">
          <p style="margin: 0 0 6px 0; color: #CBD5E1;">
            © ${new Date().getFullYear()} ASTTORIA. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 10px; color: #64748B;">
            This email was sent in response to your quotation inquiry. If you believe you received this in error, please disregard.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`[Customer Email Simulated] SMTP not set.`);
    console.log(`[To]: ${lead.email} (${lead.full_name})`);
    console.log(`[Subject]: ${subject}`);
    console.log(`[Body]:\n${message}`);
    return {
      success: true,
      simulated: true,
      message: `SMTP not configured in server/.env — reply logged to console. To send real emails, add SMTP_USER & SMTP_PASS in server/.env.`
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: lead.email,
      subject: subject,
      html: htmlContent
    });
    console.log('Customer reply email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending customer reply email:', error);
    return { success: false, error: error.message };
  }
}
