/**
 * J Homes journal.
 *
 * 1. If this script was created from the sheet (Extensions → Apps Script), leave JOURNAL_SHEET_ID as it is.
 *    Otherwise paste the sheet id from the link (the part after /d/).
 * 2. Deploy → Manage deployments → Edit → New version → Deploy.
 *    Execute as: Me. Who has access: Anyone.
 * 3. The site reads this web app. The first read writes the Journal tab when it is still empty.
 *    A post with {"action":"seed"} writes the posts again.
 *
 * Columns: Slug, Title, Description, SEO title, Kicker, Order, Block type, Text.
 * Block type is Heading or Paragraph. A blank Text cell is skipped on the site.
 * A blank Title, Description, SEO title, or Kicker is left off the page.
 */

var JOURNAL_SHEET_ID = 'PASTE_JOURNAL_SHEET_ID'

var JOURNAL_HEADERS = ['Slug', 'Title', 'Description', 'SEO title', 'Kicker', 'Order', 'Block type', 'Text']

var JOURNAL_ROWS = [
  [
    "planning-a-home-in-kochi",
    "Planning a home in Kochi, from the plot to handover",
    "How a J Homes residence moves from land and design through approvals, construction, interiors and handover in Kochi and Ernakulam.",
    "Planning a Home in Kochi | J Homes",
    "Guide",
    1,
    "Paragraph",
    "Most people begin with a picture of a finished house. The useful work starts earlier, with the land and a clear order of decisions. In and around Kochi and Ernakulam, that order is what keeps a residential project from splitting into unrelated contractors."
  ],
  [
    "planning-a-home-in-kochi",
    "",
    "",
    "",
    "",
    2,
    "Heading",
    "Begin with the site"
  ],
  [
    "planning-a-home-in-kochi",
    "",
    "",
    "",
    "",
    3,
    "Paragraph",
    "A plot in Mulanthuruthy is not a plot in Thiruvaniyoor. One of the houses in the J Homes record sits on 4.5 cents; another is a ground-floor home on 50 cents. Before plans are drawn, the site needs a reading: access, the ground, and whether the house you want is feasible there. If you do not yet have land, the same questions describe what you should be looking for."
  ],
  [
    "planning-a-home-in-kochi",
    "",
    "",
    "",
    "",
    4,
    "Heading",
    "Then draw, then coordinate"
  ],
  [
    "planning-a-home-in-kochi",
    "",
    "",
    "",
    "",
    5,
    "Paragraph",
    "Architectural plans, a site plan, elevations and working drawings give everyone the same picture. Structural information, electrical layouts and plumbing layouts belong with that set. Approvals, including K-SMART where the local body uses it, are coordinated from those drawings rather than invented at the counter."
  ],
  [
    "planning-a-home-in-kochi",
    "",
    "",
    "",
    "",
    6,
    "Heading",
    "Build, finish, hand over"
  ],
  [
    "planning-a-home-in-kochi",
    "",
    "",
    "",
    "",
    7,
    "Paragraph",
    "Construction is a sequence: foundation, structure, masonry, roof, electrical, plumbing, finishing. Interiors — kitchen, wardrobes, ceilings, lighting, floors — and furniture follow as part of the same project when the brief is turnkey. Handover is the point at which the home is ready to live in, not merely roofed."
  ],
  [
    "planning-a-home-in-kochi",
    "",
    "",
    "",
    "",
    8,
    "Paragraph",
    "If you are deciding where to start, say so plainly: you have land, you need land, you have a design, or you want the complete path. That single fact tells J Homes which drawing, or which site visit, should come next."
  ],
  [
    "what-a-turnkey-home-includes",
    "What a turnkey home with J Homes includes",
    "The scope of a J Homes turnkey residence: land, design, approvals, engineering, construction, interiors, furniture, landscape and handover.",
    "What Turnkey Construction Includes | J Homes",
    "Guide",
    1,
    "Paragraph",
    "Turnkey is an easy word to stretch. At J Homes it means a defined journey with one team: from the first step on the land to the final finish of the rooms."
  ],
  [
    "what-a-turnkey-home-includes",
    "",
    "",
    "",
    "",
    2,
    "Heading",
    "The full arc"
  ],
  [
    "what-a-turnkey-home-includes",
    "",
    "",
    "",
    "",
    3,
    "Paragraph",
    "The scope covers land selection, planning, architectural design, approvals, engineering, construction, interior design, furniture, furnishing, landscaping and handover. You may not need every chapter. Someone who already holds a design does not need to pretend they are starting from a blank sheet. Someone who wants the complete path should not be left to appoint a new team at the plaster stage."
  ],
  [
    "what-a-turnkey-home-includes",
    "",
    "",
    "",
    "",
    4,
    "Heading",
    "What stays together"
  ],
  [
    "what-a-turnkey-home-includes",
    "",
    "",
    "",
    "",
    5,
    "Paragraph",
    "The value is coordination. A furniture layout that ignores the electrical plan, or a ceiling that is decided after the slab, creates avoidable rework. One team keeps design, engineering, construction and interiors in a single sequence. Quality checks — materials, supervision, workmanship, inspection — sit inside that sequence."
  ],
  [
    "what-a-turnkey-home-includes",
    "",
    "",
    "",
    "",
    6,
    "Heading",
    "What it does not mean"
  ],
  [
    "what-a-turnkey-home-includes",
    "",
    "",
    "",
    "",
    7,
    "Paragraph",
    "It does not mean a fixed promise about another family’s plot, and it does not skip the authority’s process. Permits follow the local route. K-SMART is used where that is the authority’s system. The outcome of an application is not something a builder should guarantee in a brochure."
  ],
  [
    "what-a-turnkey-home-includes",
    "",
    "",
    "",
    "",
    8,
    "Paragraph",
    "If you want this scope, start by naming your stage. The next meeting is more useful when J Homes knows whether the conversation is about land, drawings, or a house ready to be built and finished."
  ],
  [
    "drawings-that-guide-a-build",
    "The drawings that guide a residential build",
    "A plain-language guide to the plans, elevations and service layouts J Homes uses before and during house construction.",
    "Residential Drawings Explained | J Homes",
    "Guide",
    1,
    "Paragraph",
    "A house is built from drawings long before it is built from brick. These are the sheets J Homes uses, described without the jargon that makes a first-time client feel locked out of their own project."
  ],
  [
    "drawings-that-guide-a-build",
    "",
    "",
    "",
    "",
    2,
    "Heading",
    "The architectural set"
  ],
  [
    "drawings-that-guide-a-build",
    "",
    "",
    "",
    "",
    3,
    "Paragraph",
    "Architectural plans show the rooms, the walls and the levels. A site plan shows the building on the plot — setbacks, access, and how the house sits on the land. A 3D elevation shows the outside: the roof, the openings, the character of the front. Landscape drawings describe the ground around the building. Working drawings carry the dimensions and details the site needs day to day."
  ],
  [
    "drawings-that-guide-a-build",
    "",
    "",
    "",
    "",
    4,
    "Heading",
    "Structure and services"
  ],
  [
    "drawings-that-guide-a-build",
    "",
    "",
    "",
    "",
    5,
    "Paragraph",
    "Structural drawings describe the frame that holds the house up. Electrical layouts place lights, fans and points. Plumbing layouts trace water and waste. These are not optional extras on a serious house. If they disagree with the floor plan, the site will discover the disagreement at the worst moment."
  ],
  [
    "drawings-that-guide-a-build",
    "",
    "",
    "",
    "",
    6,
    "Heading",
    "Furniture, before the rooms are full"
  ],
  [
    "drawings-that-guide-a-build",
    "",
    "",
    "",
    "",
    7,
    "Paragraph",
    "A furniture layout checks that the dining table, the bed and the wardrobe actually fit the rooms that were drawn. It also tells the electrical plan where a bedside point or a television point wants to be. Custom furniture, later, has a wall to belong to."
  ],
  [
    "drawings-that-guide-a-build",
    "",
    "",
    "",
    "",
    8,
    "Paragraph",
    "You do not need to read every sheet like an engineer. You do need a team that is reading the same set. That is the standard J Homes works to, from the first plan to the final finish."
  ]
]

function journalBook_() {
  var active = SpreadsheetApp.getActiveSpreadsheet()
  if (active) return active
  if (!JOURNAL_SHEET_ID || String(JOURNAL_SHEET_ID).indexOf('PASTE_') === 0) {
    throw new Error('Set JOURNAL_SHEET_ID to the id in the Google Sheet link.')
  }
  return SpreadsheetApp.openById(JOURNAL_SHEET_ID)
}

function doGet() {
  try {
    var book = journalBook_()
    var sheet = book.getSheetByName('Journal')
    if (!sheet || sheet.getLastRow() < 2) {
      seedJournal()
      sheet = book.getSheetByName('Journal')
    }
    var values = sheet.getDataRange().getValues()
    var rows = values.map(function (row) {
      return row.map(function (cell) {
        return cell == null ? '' : String(cell)
      })
    })
    return json_({ ok: true, rows: rows })
  } catch (error) {
    return json_({ ok: false, error: String(error) })
  }
}

function doPost(e) {
  try {
    var raw = (e && e.parameter && (e.parameter.payload || e.parameter.action)) || (e && e.postData && e.postData.contents) || ''
    var action = String(raw || '')
    try {
      var data = JSON.parse(raw)
      if (data && data.action) action = String(data.action)
    } catch (ignore) {}
    if (action === 'seed') seedJournal()
    return doGet()
  } catch (error) {
    return json_({ ok: false, error: String(error) })
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)
}

function seedJournal() {
  var book = journalBook_()
  var sheet = book.getSheetByName('Journal')
  if (!sheet) sheet = book.insertSheet('Journal')
  sheet.clear()
  var values = [JOURNAL_HEADERS].concat(JOURNAL_ROWS)
  sheet.getRange(1, 1, values.length, JOURNAL_HEADERS.length).setValues(values)
  sheet.setFrozenRows(1)
  sheet.getRange(1, 1, 1, JOURNAL_HEADERS.length).setFontWeight('bold')
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(['Heading', 'Paragraph'], true).setAllowInvalid(false).build()
  if (JOURNAL_ROWS.length) sheet.getRange(2, 7, JOURNAL_ROWS.length, 1).setDataValidation(rule)
  sheet.autoResizeColumns(1, JOURNAL_HEADERS.length)
}
