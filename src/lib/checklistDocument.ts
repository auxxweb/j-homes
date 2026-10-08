import {
  checklistQuestions,
  formatAnswer,
  visibleQuestions,
  type Answers,
} from '../data/checklist'

const sectionHeading: Record<string, string> = {
  'About you': '',
  Project: '1. PROJECT INFORMATION',
  'Ground floor': '2. GROUND FLOOR REQUIREMENTS',
  Additional: '3. ADDITIONAL REQUIREMENTS',
  'First floor': '4. FIRST FLOOR REQUIREMENTS',
  Outdoor: '5. OUTDOOR PLANNING',
  Special: '6. SPECIAL REQUIREMENTS',
  Design: '7. DESIGN PREFERENCES',
  Remarks: '8. CLIENT REMARKS',
}

function text(answers: Answers, id: string) {
  const value = answers[id]
  if (Array.isArray(value)) return value.join(', ')
  return value?.trim() ?? ''
}

function fieldValue(questionId: string, shown: string) {
  if (shown === 'Not specified' || shown === 'Skipped') return shown
  if (questionId === 'plotSize') return `${shown} cents`
  if (questionId === 'houseSize') return `${shown} sq.ft`
  if (questionId === 'budget') return `Rs ${shown}`
  return shown
}

export function checklistTitle(answers: Answers) {
  const name = text(answers, 'clientName') || 'Client'
  const day = text(answers, 'checklistDate') || new Date().toISOString().slice(0, 10)
  return `J Homes checklist — ${name} — ${day}`
}

export function checklistDocument(answers: Answers, submittedAt: string) {
  const lines: string[] = [
    'J HOMES CONSTRUCTIONS',
    'Client requirement checklist',
    'Residential home design and construction',
    '',
    'Designing Your Dreams, Building with Quality.',
    '',
    `Client name: ${text(answers, 'clientName') || '—'}`,
    `Contact no.: ${text(answers, 'contact') || '—'}`,
    `Project location: ${text(answers, 'location') || '—'}`,
    `Date: ${text(answers, 'checklistDate') || '—'}`,
    `Submitted: ${new Date(submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`,
    '',
  ]

  let section = ''
  for (const question of visibleQuestions(answers)) {
    if (!(question.id in answers) || question.id === 'signature' || question.section === 'About you') continue
    if (question.section !== section) {
      section = question.section
      const heading = sectionHeading[question.section] ?? question.section.toUpperCase()
      if (heading) lines.push('', heading)
    }
    lines.push(`${question.label}: ${fieldValue(question.id, formatAnswer(question, answers[question.id]))}`)
  }

  lines.push(`Client signature: ${text(answers, 'signature') || '________________________'}`)
  lines.push(`Date: ${text(answers, 'checklistDate') || '________________________'}`)
  lines.push('')
  lines.push('J HOMES CONSTRUCTIONS')
  lines.push('Designing Your Dreams, Building with Quality.')
  return lines.join('\n')
}

export function checklistRow(answers: Answers, submittedAt: string) {
  const question = (id: string) => {
    const item = checklistQuestions.find((entry) => entry.id === id)
    if (!item || !(id in answers)) return ''
    return formatAnswer(item, answers[id])
  }
  return {
    Submitted: submittedAt,
    'Client name': text(answers, 'clientName'),
    'Contact no.': text(answers, 'contact'),
    'Project location': text(answers, 'location'),
    Date: text(answers, 'checklistDate'),
    'Plot size (cents)': text(answers, 'plotSize'),
    'House size (sq.ft)': text(answers, 'houseSize'),
    Bedrooms: text(answers, 'bedrooms'),
    Parking: [question('parking'), question('parkingMore')].filter(Boolean).join(' — '),
    Style: [question('style'), question('styleOther')].filter(Boolean).join(' — '),
    'Estimated budget': text(answers, 'budget'),
    'Start date': text(answers, 'startDate'),
    'Expected completion': text(answers, 'completion'),
    'PDF URL': '',
    Checklist: checklistDocument(answers, submittedAt),
  }
}
