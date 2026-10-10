import axios from 'axios';

/**
 * Sync lead inquiry to Google Sheet via Webhook (Google Apps Script)
 *
 * How it works:
 * 1. Admin creates a Google Sheet (columns: Date, Name, Company, Phone, Email, Location, Products, Qty, Contact Method, Status, Remarks)
 * 2. In Google Sheets: Extensions > Apps Script > paste the provided Webhook Script > Deploy as Web App.
 * 3. Put Web App URL in GOOGLE_SHEET_WEBHOOK_URL in server/.env or settings.
 */
export async function syncLeadToGoogleSheet(lead) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      synced: false,
      message: 'GOOGLE_SHEET_WEBHOOK_URL not configured in server/.env'
    };
  }

  const payload = {
    date: new Date(lead.createdAt || Date.now()).toISOString(),
    fullName: lead.full_name,
    company: lead.company_name || 'Individual',
    phone: lead.phone,
    email: lead.email,
    location: lead.project_location || '',
    quantity: lead.quantity_required || '',
    products: Array.isArray(lead.products_required) ? lead.products_required.join(', ') : '',
    contactMethod: lead.contact_method || 'Phone',
    requirements: lead.additional_requirements || '',
    remarks: lead.remarks || '',
    status: lead.status || 'New'
  };

  try {
    const res = await axios.post(webhookUrl, payload, { timeout: 10000 });
    console.log('Lead synced to Google Sheet successfully');
    return { synced: true, data: res.data };
  } catch (error) {
    console.error('Failed to sync lead to Google Sheet webhook:', error.message);
    return { synced: false, error: error.message };
  }
}

/**
 * Returns ready-to-use Google Apps Script code for the admin
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission Date",
        "Customer Name",
        "Company / Org",
        "Phone",
        "Email",
        "Project Location",
        "Quantity Required",
        "Products Required",
        "Contact Method",
        "Client Requirements",
        "Status",
        "Remarks"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#0B1220").setFontColor("#FFFFFF");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.fullName || "",
      data.company || "",
      data.phone || "",
      data.email || "",
      data.location || "",
      data.quantity || "",
      data.products || "",
      data.contactMethod || "",
      data.requirements || "",
      data.status || "New",
      data.remarks || ""
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`.trim();
