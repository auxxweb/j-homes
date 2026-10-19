import { cmsApi, cmsSite } from '../cms/CmsProvider'
import type { Answers } from '../data/checklist'
import { checklistAnswers, checklistDocument, checklistRow, checklistTitle } from './checklistDocument'
import { checklistPdf, checklistPdfBase64 } from './checklistPdf'
import { postGoogle, type GooglePostResult } from './googlePost'

export interface ChecklistResult {
  ok: boolean
  error?: string
  docUrl?: string
  mailed?: boolean
  mailError?: string
}

export function checklistEndpoint() {
  return (import.meta.env.VITE_CHECKLIST_ENDPOINT ?? '').trim()
}

let inFlight: Promise<ChecklistResult> | null = null

export function submitChecklist(answers: Answers, submittedAt = new Date().toISOString(), pdf = checklistPdf(answers, submittedAt)): Promise<ChecklistResult> {
  if (inFlight) return inFlight
  const cms = cmsApi()
  if (cms) {
    const request = postChecklist(cms, answers, submittedAt, pdf)
    inFlight = request
    void request.finally(() => {
      if (inFlight === request) inFlight = null
    })
    return request
  }
  const endpoint = checklistEndpoint()
  if (!endpoint) return Promise.resolve({ ok: false, error: 'The admin panel is not connected yet.' })

  const row = checklistRow(answers, submittedAt)
  const payload = {
    token: (import.meta.env.VITE_CHECKLIST_TOKEN ?? '').trim(),
    submissionId: crypto.randomUUID(),
    documentTitle: checklistTitle(answers),
    documentText: checklistDocument(answers, submittedAt),
    pdfBase64: checklistPdfBase64(pdf),
    row,
    submittedAt,
  }

  const request = postGoogle(endpoint, payload).then(toChecklistResult)
  inFlight = request
  void request.finally(() => {
    if (inFlight === request) inFlight = null
  })
  return request
}

function answerText(answers: Answers, id: string) {
  const value = answers[id]
  return typeof value === 'string' ? value.trim() : ''
}

function postChecklist(endpoint: string, answers: Answers, submittedAt: string, pdf: Uint8Array): Promise<ChecklistResult> {
  return fetch(`${endpoint}/api/public/${cmsSite()}/checklists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: answerText(answers, 'clientName'),
      phone: answerText(answers, 'contact'),
      location: answerText(answers, 'location'),
      checklistDate: answerText(answers, 'checklistDate'),
      signature: answerText(answers, 'signature'),
      answers: checklistAnswers(answers),
      pdfBase64: checklistPdfBase64(pdf),
      submittedAt,
    }),
  })
    .then(async (response) => {
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; pdfUrl?: string }
      if (!response.ok || data.ok === false) return { ok: false, error: data.error || 'The checklist could not be saved.' }
      return { ok: true, docUrl: data.pdfUrl }
    })
    .catch(() => ({ ok: false, error: 'The connection failed.' }))
}

function toChecklistResult(result: GooglePostResult): ChecklistResult {
  return { ok: result.ok, error: result.error, docUrl: result.docUrl, mailed: result.mailed, mailError: result.mailError }
}
