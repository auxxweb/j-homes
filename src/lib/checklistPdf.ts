import type { Answers } from '../data/checklist'

const NAVY = '0.102 0.247 0.455'
const INK = '0.086 0.078 0.071'
const CRIMSON = '0.737 0 0'
const LEFT = 54
const RIGHT = 541

function latin(value: string) {
  return value
    .replaceAll('₹', 'Rs ')
    .replaceAll('—', '-')
    .replaceAll('–', '-')
    .replaceAll('’', "'")
    .replaceAll('‘', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replace(/[^\n\x20-\x7E]/g, '')
}

function escapePdf(value: string) {
  return latin(value).replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function widthOf(text: string, size: number, bold: boolean) {
  return latin(text).length * size * (bold ? 0.62 : 0.56)
}

function field(answers: Answers, id: string) {
  const value = answers[id]
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed === 'Skipped') return ''
  return trimmed
}

function picked(answers: Answers, id: string) {
  const value = answers[id]
  if (Array.isArray(value)) return value.filter((item) => item && item !== 'none')
  if (!value || value === 'Skipped') return []
  return [value]
}

class FormSheet {
  private pages: string[] = []
  private commands: string[] = []
  private y = 786

  private ensure(space: number) {
    if (this.y - space >= 52) return
    this.pages.push(this.commands.join('\n'))
    this.commands = []
    this.y = 786
  }

  private raw(command: string) {
    this.commands.push(command)
  }

  private paint(text: string, x: number, size: number, font: 'F1' | 'F2', color: string) {
    this.raw(`${color} rg`)
    this.raw(`BT /${font} ${size} Tf 1 0 0 1 ${x.toFixed(1)} ${this.y.toFixed(1)} Tm (${escapePdf(text)}) Tj ET`)
  }

  private rule(x1: number, x2: number, color: string) {
    this.raw(`${color} RG 0.7 w ${x1.toFixed(1)} ${(this.y - 2).toFixed(1)} m ${x2.toFixed(1)} ${(this.y - 2).toFixed(1)} l S`)
  }

  center(text: string, size: number, font: 'F1' | 'F2', color: string, underline = false) {
    this.ensure(size + 12)
    const span = widthOf(text, size, font === 'F2')
    const x = (595 - span) / 2
    this.paint(text, x, size, font, color)
    if (underline) this.rule(x, x + span, color)
    this.y -= size + (underline ? 12 : 7)
  }

  gap(amount: number) {
    this.y -= amount
  }

  section(title: string) {
    this.ensure(28)
    this.gap(6)
    this.paint(title, LEFT, 12, 'F2', NAVY)
    this.y -= 5
    this.raw(`${NAVY} RG 0.8 w ${LEFT} ${this.y.toFixed(1)} m ${RIGHT} ${this.y.toFixed(1)} l S`)
    this.y -= 16
  }

  heading(title: string) {
    this.ensure(18)
    this.paint(title, LEFT, 11, 'F2', INK)
    this.y -= 16
  }

  labeled(label: string, value: string, suffix = '') {
    this.ensure(16)
    this.paint(label, LEFT, 11, 'F2', INK)
    let x = LEFT + widthOf(label, 11, true) + 8
    if (value) {
      this.paint(value, x, 11, 'F1', INK)
      const span = Math.max(widthOf(value, 11, false), 36)
      this.rule(x, x + span, INK)
      x += span + 8
    } else {
      this.rule(x, x + 120, INK)
      x += 128
    }
    if (suffix) this.paint(suffix, x, 11, 'F1', INK)
    this.y -= 16
  }

  paragraph(label: string, value: string) {
    const text = value || ''
    const words = latin(text).split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let current = ''
    const max = 86
    for (const word of words) {
      const next = current ? `${current} ${word}` : word
      if (next.length > max && current) {
        lines.push(current)
        current = word
      } else current = next
    }
    if (current) lines.push(current)
    this.ensure(16)
    this.paint(label, LEFT, 11, 'F2', INK)
    if (lines.length === 0) {
      this.rule(LEFT + widthOf(label, 11, true) + 8, LEFT + widthOf(label, 11, true) + 228, INK)
      this.y -= 16
      return
    }
    const firstX = LEFT + widthOf(label, 11, true) + 8
    this.paint(lines[0], firstX, 11, 'F1', INK)
    this.y -= 15
    for (const line of lines.slice(1)) {
      this.ensure(15)
      this.paint(line, LEFT, 11, 'F1', INK)
      this.y -= 15
    }
  }

  checks(items: { id: string; label: string }[], selected: string[]) {
    const chosen = new Set(selected)
    for (const item of items) {
      this.ensure(15)
      const on = chosen.has(item.id)
      this.raw(`${INK} rg ${LEFT + 6} ${(this.y + 2).toFixed(1)} 2.2 2.2 re f`)
      const box = LEFT + 18
      const bottom = this.y - 1
      this.raw(`${INK} RG 0.8 w ${box} ${bottom.toFixed(1)} 8 8 re S`)
      if (on) {
        this.raw(
          `1.35 w ${box + 1.5} ${(bottom + 3.7).toFixed(1)} m ${box + 3.2} ${(bottom + 1.7).toFixed(1)} l ${box + 6.7} ${(bottom + 6.5).toFixed(1)} l S`,
        )
      }
      this.paint(item.label, box + 14, 11, 'F1', INK)
      this.y -= 15
    }
  }

  inlineChecks(label: string, items: { id: string; label: string }[], selected: string[]) {
    this.ensure(16)
    this.paint(label, LEFT, 11, 'F2', INK)
    let x = LEFT + widthOf(label, 11, true) + 8
    const chosen = new Set(selected)
    for (const item of items) {
      const bottom = this.y - 1
      this.raw(`${INK} RG 0.8 w ${x.toFixed(1)} ${bottom.toFixed(1)} 8 8 re S`)
      if (chosen.has(item.id)) {
        this.raw(
          `1.35 w ${(x + 1.5).toFixed(1)} ${(bottom + 3.7).toFixed(1)} m ${(x + 3.2).toFixed(1)} ${(bottom + 1.7).toFixed(1)} l ${(x + 6.7).toFixed(1)} ${(bottom + 6.5).toFixed(1)} l S`,
        )
      }
      x += 12
      this.paint(item.label, x, 11, 'F1', INK)
      x += widthOf(item.label, 11, false) + 12
    }
    this.y -= 16
  }

  finish() {
    this.pages.push(this.commands.join('\n'))
    return encode(this.pages.filter((page) => page.length > 0))
  }
}

function yesNo(value: string) {
  if (value === 'yes' || value === 'required') return ['required']
  if (value === 'no' || value === 'not-required') return ['not-required']
  return value ? [value] : []
}

export function checklistPdf(answers: Answers, _submittedAt: string) {
  const sheet = new FormSheet()
  sheet.center('J HOMES', 20, 'F2', CRIMSON)
  sheet.center('CONSTRUCTIONS', 8, 'F2', CRIMSON)
  sheet.gap(4)
  sheet.center('CLIENT REQUIREMENT CHECKLIST', 13, 'F2', NAVY, true)
  sheet.center('(Residential Home Design & Construction)', 10, 'F1', INK)
  sheet.gap(8)
  sheet.labeled('Client Name:', field(answers, 'clientName'))
  sheet.labeled('Contact No.:', field(answers, 'contact'))
  sheet.labeled('Project Location:', field(answers, 'location'))
  sheet.labeled('Date:', field(answers, 'checklistDate'))

  sheet.section('1. PROJECT INFORMATION')
  sheet.labeled('Plot Size:', field(answers, 'plotSize'), 'Cents')
  sheet.labeled('House Size:', field(answers, 'houseSize'), 'Sq.ft.')
  sheet.labeled('Number of Bedrooms:', field(answers, 'bedrooms'))
  sheet.heading('Parking Requirement:')
  const parkingMore = field(answers, 'parkingMore')
  sheet.checks(
    [
      { id: '1', label: '1 Car' },
      { id: '2', label: '2 Cars' },
      { id: '3', label: '3 Cars' },
      { id: 'more', label: parkingMore ? `More: ${parkingMore}` : 'More:' },
    ],
    picked(answers, 'parking'),
  )
  sheet.heading('Preferred Architectural Style:')
  const styleOther = field(answers, 'styleOther')
  sheet.checks(
    [
      { id: 'modern', label: 'Modern' },
      { id: 'contemporary', label: 'Contemporary' },
      { id: 'kerala', label: 'Traditional Kerala' },
      { id: 'european', label: 'European' },
      { id: 'minimalist', label: 'Minimalist' },
      { id: 'other', label: styleOther ? `Other: ${styleOther}` : 'Other:' },
    ],
    picked(answers, 'style'),
  )
  sheet.checks([{ id: 'budget', label: `Estimated Budget: Rs ${field(answers, 'budget')}`.trim() }], field(answers, 'budget') ? ['budget'] : [])
  sheet.checks([{ id: 'timeline', label: 'Expected Project Timeline' }], field(answers, 'startDate') || field(answers, 'completion') ? ['timeline'] : [])
  sheet.labeled('Start Date:', field(answers, 'startDate'))
  sheet.labeled('Expected Completion:', field(answers, 'completion'))

  sheet.section('2. GROUND FLOOR REQUIREMENTS')
  sheet.heading('Sit-out')
  sheet.checks([{ id: 'required', label: 'Required' }], picked(answers, 'sitOut'))
  sheet.inlineChecks('No. of Seating:', [
    { id: '2', label: '2' },
    { id: '4', label: '4' },
    { id: '6', label: '6' },
  ], picked(answers, 'sitOutSeating'))
  sheet.paragraph('Remarks:', field(answers, 'sitOutRemarks'))
  sheet.heading('Living Room')
  sheet.checks(
    [
      { id: 'formal', label: 'Formal Living' },
      { id: 'family', label: 'Family Living' },
      { id: 'both', label: 'Both' },
    ],
    picked(answers, 'living'),
  )
  sheet.paragraph('Remarks:', field(answers, 'livingRemarks'))
  sheet.heading('Dining')
  sheet.checks(
    [
      { id: 'open', label: 'Open Dining' },
      { id: 'separate', label: 'Separate Dining' },
      { id: 'kitchen', label: 'Dining with Kitchen' },
    ],
    picked(answers, 'dining'),
  )
  sheet.paragraph('Remarks:', field(answers, 'diningRemarks'))
  sheet.heading('Kitchen')
  sheet.checks(
    [
      { id: 'open', label: 'Open Kitchen' },
      { id: 'closed', label: 'Closed Kitchen' },
      { id: 'island', label: 'Island Kitchen' },
    ],
    picked(answers, 'kitchen'),
  )
  sheet.paragraph('Remarks:', field(answers, 'kitchenRemarks'))
  sheet.heading('Ground Floor Bedrooms')
  sheet.inlineChecks('Required:', [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ], picked(answers, 'groundBedrooms'))
  sheet.labeled('Number of Bedrooms:', field(answers, 'groundBedroomCount'))
  sheet.heading('Patio')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not Required' },
    ],
    picked(answers, 'patio'),
  )
  sheet.heading('Bathrooms')
  sheet.labeled('Attached Bathrooms:', field(answers, 'groundAttachedBaths'))
  sheet.labeled('Common Bathrooms:', field(answers, 'groundCommonBaths'))

  sheet.section('3. ADDITIONAL REQUIREMENTS')
  sheet.heading('Store Room')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not Required' },
    ],
    yesNo(field(answers, 'store')),
  )
  sheet.heading('Work Area')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not Required' },
    ],
    yesNo(field(answers, 'workArea')),
  )
  sheet.heading('Laundry Area')
  sheet.checks(
    [
      { id: 'ground', label: 'Ground Floor' },
      { id: 'first', label: 'First Floor' },
      { id: 'outdoor', label: 'Outdoor' },
    ],
    picked(answers, 'laundry'),
  )
  sheet.heading('Outdoor Patio')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not Required' },
    ],
    yesNo(field(answers, 'outdoorPatio')),
  )
  sheet.heading('Swimming Pool')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'future', label: 'Future Provision' },
      { id: 'not-required', label: 'Not Required' },
    ],
    picked(answers, 'pool'),
  )
  sheet.heading('Courtyard')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not Required' },
    ],
    yesNo(field(answers, 'courtyard')),
  )
  sheet.heading('Double Height Space')
  sheet.checks(
    [
      { id: 'living', label: 'Living Room' },
      { id: 'dining', label: 'Dining' },
      { id: 'stair', label: 'Stair Area' },
      { id: 'not-required', label: 'Not Required' },
    ],
    picked(answers, 'doubleHeight'),
  )

  sheet.section('4. FIRST FLOOR REQUIREMENTS')
  sheet.labeled('Number of Bedrooms:', field(answers, 'firstBedrooms'))
  sheet.heading('Living Area')
  sheet.checks(
    [
      { id: 'family', label: 'Family Living' },
      { id: 'tv', label: 'TV Lounge' },
      { id: 'not-required', label: 'Not Required' },
    ],
    picked(answers, 'firstLiving'),
  )
  sheet.heading('Bathrooms')
  sheet.labeled('Attached Bathrooms:', field(answers, 'firstAttachedBaths'))
  sheet.labeled('Common Bathrooms:', field(answers, 'firstCommonBaths'))
  sheet.heading('Balcony')
  sheet.checks(
    [
      { id: 'front', label: 'Front' },
      { id: 'rear', label: 'Rear' },
      { id: 'side', label: 'Side' },
      { id: 'not-required', label: 'Not Required' },
    ],
    picked(answers, 'balcony'),
  )
  sheet.heading('Open Terrace')
  sheet.checks(
    [
      { id: 'front', label: 'Front' },
      { id: 'rear', label: 'Rear' },
      { id: 'side', label: 'Side' },
      { id: 'full', label: 'Full Terrace' },
      { id: 'not-required', label: 'Not Required' },
    ],
    picked(answers, 'terrace'),
  )
  sheet.heading('Home Theatre')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'future', label: 'Future Provision' },
      { id: 'not-required', label: 'Not Required' },
    ],
    picked(answers, 'theatre'),
  )
  sheet.heading('Bar Counter')
  sheet.checks(
    [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not Required' },
    ],
    yesNo(field(answers, 'bar')),
  )

  sheet.section('5. OUTDOOR PLANNING')
  sheet.checks(
    [
      { id: 'front-garden', label: 'Front Garden' },
      { id: 'backyard', label: 'Backyard Garden' },
      { id: 'lawn', label: 'Lawn' },
      { id: 'play', label: "Children's Play Area" },
      { id: 'seating', label: 'Outdoor Seating' },
      { id: 'bbq', label: 'BBQ Area' },
      { id: 'water', label: 'Water Feature' },
      { id: 'compound', label: 'Compound Wall' },
      { id: 'sliding-gate', label: 'Sliding Gate' },
      { id: 'swing-gate', label: 'Swing Gate' },
    ],
    picked(answers, 'outdoor'),
  )

  sheet.section('6. SPECIAL REQUIREMENTS')
  sheet.checks(
    [
      { id: 'office', label: 'Home Office' },
      { id: 'prayer', label: 'Prayer Room' },
      { id: 'lift-provision', label: 'Lift Provision' },
      { id: 'lift', label: 'Lift' },
      { id: 'solar', label: 'Solar Panels' },
      { id: 'ev', label: 'EV Charging Point' },
      { id: 'rain', label: 'Rainwater Harvesting' },
      { id: 'smart', label: 'Smart Home Automation' },
      { id: 'cctv', label: 'CCTV' },
      { id: 'security', label: 'Security Room' },
      { id: 'maid', label: 'Maid Room' },
      { id: 'driver', label: 'Driver Room' },
      { id: 'access', label: 'Wheelchair Accessibility' },
    ],
    picked(answers, 'special'),
  )
  sheet.paragraph('Other Requirements:', field(answers, 'specialOther'))

  sheet.section('7. DESIGN PREFERENCES')
  sheet.paragraph('Preferred Colour Theme', field(answers, 'colours'))
  sheet.paragraph('Preferred Flooring', field(answers, 'flooring'))
  sheet.paragraph('Preferred Roofing Style', field(answers, 'roofing'))
  sheet.paragraph('Special Design Inspirations', field(answers, 'inspiration'))

  sheet.section('8. CLIENT REMARKS')
  sheet.paragraph('Remarks:', field(answers, 'remarks'))
  sheet.gap(8)
  sheet.labeled('Client Signature:', field(answers, 'signature'))
  sheet.labeled('Date:', field(answers, 'checklistDate'))
  sheet.gap(14)
  sheet.center('J HOMES CONSTRUCTIONS', 11, 'F2', NAVY)
  sheet.center('"Designing Your Dreams, Building with Quality."', 10, 'F1', INK)
  return sheet.finish()
}

function encode(pages: string[]) {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ]
  const kids: string[] = []
  pages.forEach((stream, index) => {
    const pageId = 5 + index * 2
    kids.push(`${pageId} 0 R`)
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageId + 1} 0 R >>`,
    )
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
  })
  objects[1] = `<< /Type /Pages /Count ${pages.length} /Kids [${kids.join(' ')}] >>`
  let body = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(body).length)
    body += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const start = new TextEncoder().encode(body).length
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`
  return new TextEncoder().encode(body + xref)
}

export function checklistPdfBase64(bytes: Uint8Array) {
  let binary = ''
  const step = 0x8000
  for (let index = 0; index < bytes.length; index += step) {
    binary += String.fromCharCode(...bytes.subarray(index, index + step))
  }
  return btoa(binary)
}
