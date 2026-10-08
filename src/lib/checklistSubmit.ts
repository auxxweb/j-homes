import type { Answers } from '../data/checklist'
import { checklistDocument, checklistRow, checklistTitle } from './checklistDocument'
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
  const endpoint = checklistEndpoint()
  if (!endpoint) return Promise.resolve({ ok: false, error: 'Google is not connected yet.' })

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

function toChecklistResult(result: GooglePostResult): ChecklistResult {
  return { ok: result.ok, error: result.error, docUrl: result.docUrl, mailed: result.mailed, mailError: result.mailError }
}
