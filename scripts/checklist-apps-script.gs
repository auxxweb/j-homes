/**
 * J Homes client requirement checklist.
 *
 * Paste this into a new Google Apps Script project, then:
 * 1. Replace FOLDER_ID with the id from the Drive folder link (the part after /folders/).
 * 2. Replace SHEET_ID with the id from the Google Sheet link (the part after /d/).
 * 3. Replace TOKEN with a long random string, and put the same string in VITE_CHECKLIST_TOKEN.
 * 4. Deploy → New deployment → Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Copy the web app URL (it ends in /exec) into VITE_CHECKLIST_ENDPOINT.
 * 6. Share the Drive folder and the Sheet with the Google account that owns this script, as Editor.
 * 7. In the function list, choose approveMail, which is listed with doPost. Click Run and allow sending email.
 * 8. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 *    Copy the new /exec URL into VITE_CHECKLIST_ENDPOINT.
 */

var FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID'
var SHEET_ID = 'PASTE_GOOGLE_SHEET_ID'
var TOKEN = 'PASTE_A_LONG_RANDOM_TOKEN'

function doPost(e) {
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(20000)
  } catch (error) {
    return json_({ ok: false, error: 'Busy' })
  }
  try {
    var raw = (e.parameter && e.parameter.payload) || (e.postData && e.postData.contents) || ''
    var data = JSON.parse(raw)
    if (TOKEN && data.token !== TOKEN) {
      return json_({ ok: false, error: 'Unauthorized' })
    }
    if (!data.documentText || !data.row) {
      return json_({ ok: false, error: 'Missing checklist' })
    }
    var cache = CacheService.getScriptCache()
    var key = data.submissionId ? String(data.submissionId) : ''
    if (key) {
      var prior = cache.get(key)
      if (prior) return json_(JSON.parse(prior))
    }
    var pdfUrl = writePdf_(data.documentTitle || 'J Homes checklist', data.pdfBase64, data.documentText)
    data.row['PDF URL'] = pdfUrl
    writeRow_(data.row)
    var mail = notifyChecklist_(data, pdfUrl)
    var result = { ok: true, docUrl: pdfUrl, mailed: mail.ok, mailError: mail.error }
    if (key) cache.put(key, JSON.stringify(result), 21600)
    return json_(result)
  } catch (error) {
    return json_({ ok: false, error: String(error) })
  } finally {
    lock.releaseLock()
  }
}

function approveMail() {
  MailApp.sendEmail('jhomesprojects@gmail.com', 'J Homes checklist mail approval', 'The checklist script is now allowed to send email.')
}

function writePdf_(title, base64, body) {
  var name = String(title || 'J Homes checklist').replace(/[\\/:*?"<>|]/g, ' ') + '.pdf'
  var folder = DriveApp.getFolderById(FOLDER_ID)
  if (base64) {
    return folder.createFile(Utilities.newBlob(Utilities.base64Decode(base64), 'application/pdf', name)).getUrl()
  }
  var doc = DocumentApp.create(name)
  doc.getBody().setText(body || '')
  doc.saveAndClose()
  var pdf = DriveApp.getFileById(doc.getId()).getAs('application/pdf')
  pdf.setName(name)
  var file = folder.createFile(pdf)
  DriveApp.getFileById(doc.getId()).setTrashed(true)
  return file.getUrl()
}

function writeRow_(row) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
  var keys = Object.keys(row)
  var headers = []
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(keys)
    headers = keys
  } else {
    headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0]
    keys.forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key)
        sheet.getRange(1, headers.length).setValue(key)
      }
    })
  }
  sheet.appendRow(headers.map(function (header) {
    return row[header] == null ? '' : String(row[header])
  }))
}

function notifyChecklist_(data, pdfUrl) {
  try {
    var row = data.row || {}
    var name = row['Client name'] || 'Client'
    var body = [
      'A requirement checklist was submitted on the J Homes website.',
      '',
      'Client name: ' + (row['Client name'] || ''),
      'Contact no.: ' + (row['Contact no.'] || ''),
      'Project location: ' + (row['Project location'] || ''),
      'PDF: ' + pdfUrl,
      '',
      data.documentText || ''
    ].join('\n')
    MailApp.sendEmail('jhomesprojects@gmail.com', 'New requirement checklist — ' + name, body)
    return { ok: true, error: '' }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)
}
