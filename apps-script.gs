/**
 * Google Apps Script for Golf Shot Tracker
 * This script receives data from the web app and writes it to Google Sheets
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code into the editor
 * 4. Update the SPREADSHEET_ID below with your sheet ID
 * 5. Save and Deploy as Web App (Execute as: Me, Anyone can access)
 * 6. Copy the Web App URL and update it in index.html
 */

// ===== CONFIGURATION =====
const SPREADSHEET_ID = '1IngfnPqCz9eP3KTfv5jEhElk7C9ap4WAwCOJQ_i6J_8'; // Your new sheet ID
const SHEET_NAME = 'Shot Data'; // Change if your sheet has a different name

// ===== DO NOT EDIT BELOW THIS LINE =====

function doPost(e) {
  try {
    const content = e.postData.contents;
    const jsonData = JSON.parse(content);
    const data = jsonData.data;
    
    if (!data || data.length === 0) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'No data provided' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Check if sheet is empty, if so add headers
    if (sheet.getLastRow() === 0) {
      const headers = Object.keys(data[0]);
      sheet.appendRow(headers);
    }
    
    // Write data to sheet
    const rowsToWrite = data.map(row => Object.values(row));
    const lastRow = sheet.getLastRow();
    
    // Batch write for better performance
    if (rowsToWrite.length > 0) {
      sheet.getRange(lastRow + 1, 1, rowsToWrite.length, rowsToWrite[0].length)
        .setValues(rowsToWrite);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, rowsWritten: data.length }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Golf Shot Tracker - Google Sheets Integration is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
