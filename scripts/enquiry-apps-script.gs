/**
 * J Homes contact enquiries.
 *
 * 1. Create a new Google Sheet. Extensions → Apps Script. Paste this file.
 *    If the script is not opened from that sheet, paste the sheet id into ENQUIRY_SHEET_ID.
 * 2. Deploy → New deployment → Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 3. Copy the /exec URL into VITE_ENQUIRY_ENDPOINT and restart the site.
 * 4. Deploy a new version after adding mail. The first run must allow the script to send email.
 *
 * The Enquiries tab is created on the first visit or the first form submit.
 * Column titles match the contact form.
 */

var ENQUIRY_SHEET_ID = 'PASTE_ENQUIRY_SHEET_ID'

var ENQUIRY_HEADERS = ['Submitted', 'Name', 'Phone', 'Email', 'Location', 'Approximate budget', 'Current stage', 'Message']

function enquiryBook_() {
  var active = SpreadsheetApp.getActiveSpreadsheet()
  if (active) return active
  if (!ENQUIRY_SHEET_ID || String(ENQUIRY_SHEET_ID).indexOf('PASTE_') === 0) {
    throw new Error('Set ENQUIRY_SHEET_ID to the id in the Google Sheet link.')
  }
  return SpreadsheetApp.openById(ENQUIRY_SHEET_ID)
}

function ensureSheet_() {
  var book = enquiryBook_()
  var sheet = book.getSheetByName('Enquiries')
  if (!sheet) sheet = book.insertSheet('Enquiries')
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, ENQUIRY_HEADERS.length).setValues([ENQUIRY_HEADERS]).setFontWeight('bold')
    sheet.setFrozenRows(1)
    sheet.getRange(1, 3, sheet.getMaxRows(), 1).setNumberFormat('@')
  }
  return sheet
}

function doGet() {
  try {
    ensureSheet_()
    return json_({ ok: true, headers: ENQUIRY_HEADERS })
  } catch (error) {
    return json_({ ok: false, error: String(error) })
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(20000)
  } catch (error) {
    return json_({ ok: false, error: 'Busy' })
  }
  try {
    var raw = (e && e.parameter && e.parameter.payload) || (e && e.postData && e.postData.contents) || ''
    var data = JSON.parse(raw)
    if (!data.Name || !data.Phone || !data.Location || !data['Current stage']) {
      return json_({ ok: false, error: 'Missing enquiry' })
    }
    var cache = CacheService.getScriptCache()
    var key = data.submissionId ? String(data.submissionId) : ''
    if (key) {
      var prior = cache.get(key)
      if (prior) return json_(JSON.parse(prior))
    }
    var sheet = ensureSheet_()
    var row = ENQUIRY_HEADERS.map(function (header) {
      return data[header] == null ? '' : String(data[header])
    })
    var next = sheet.getLastRow() + 1
    sheet.getRange(next, 3).setNumberFormat('@')
    sheet.getRange(next, 1, 1, ENQUIRY_HEADERS.length).setValues([row])
    var mail = notifyEnquiry_(data)
    var result = { ok: true, mailed: mail.ok, mailError: mail.error }
    if (key) cache.put(key, JSON.stringify(result), 21600)
    return json_(result)
  } catch (error) {
    return json_({ ok: false, error: String(error) })
  } finally {
    lock.releaseLock()
  }
}

function notifyEnquiry_(data) {
  try {
    var lines = ['A project enquiry was submitted on the J Homes website.', '']
    ENQUIRY_HEADERS.forEach(function (header) {
      lines.push(header + ': ' + (data[header] == null ? '' : String(data[header])))
    })
    MailApp.sendEmail('jhomesprojects@gmail.com', 'New project enquiry — ' + (data.Name || 'Client'), lines.join('\n'))
    return { ok: true, error: '' }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

function approveMail() {
  MailApp.sendEmail('jhomesprojects@gmail.com', 'J Homes mail approval', 'The J Homes script is now allowed to send email.')
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)
}
