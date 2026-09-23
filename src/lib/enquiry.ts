import { company } from '../data/company'
import { budgetLabel, budgetOptions, stageLabel, stages, type BudgetId, type StageId } from '../data/enquiry'

export interface EnquiryInput {
  name: string
  phone: string
  email: string
  location: string
  budget: string
  stage: string
  message: string
  website: string
}

export interface Enquiry {
  name: string
  phone: string
  email: string
  location: string
  budget: BudgetId | ''
  stage: StageId
  message: string
}

export type FieldErrors = Partial<Record<keyof EnquiryInput | 'form', string>>

const stageIds = new Set<string>(stages.map((stage) => stage.id))
const budgetIds = new Set<string>(budgetOptions.map((option) => option.id))

export function sanitizeText(value: string, max: number) {
  let result = ''
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0
    if (char === '<' || char === '>' || code < 32 || code === 127) continue
    result += char
  }
  return result.trim().slice(0, max)
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10 && /^[6-9]/.test(digits)) return digits
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
    return digits.slice(2)
  }
  return null
}

export function validateEnquiry(input: EnquiryInput): { errors: FieldErrors; value?: Enquiry } {
  const errors: FieldErrors = {}
  const name = sanitizeText(input.name, 80)
  const location = sanitizeText(input.location, 120)
  const email = sanitizeText(input.email, 120)
  const message = sanitizeText(input.message, 2000)
  const phone = normalizePhone(input.phone)

  if (name.length < 2) errors.name = 'Enter your name.'
  if (!phone) errors.phone = 'Enter a valid 10-digit mobile number.'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email, or leave it blank.'
  if (location.length < 2) errors.location = 'Enter the location of the project.'
  if (!stageIds.has(input.stage)) errors.stage = 'Choose where you are in the journey.'
  if (input.budget && !budgetIds.has(input.budget)) errors.budget = 'Choose a budget range, or leave it open.'

  if (Object.keys(errors).length || !phone || !stageIds.has(input.stage)) {
    return { errors }
  }

  return {
    errors,
    value: {
      name,
      phone,
      email,
      location,
      budget: (input.budget || '') as BudgetId | '',
      stage: input.stage as StageId,
      message,
    },
  }
}

export function enquiryText(data: Enquiry) {
  return [
    company.whatsappMessage,
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : '',
    `Location: ${data.location}`,
    `Stage: ${stageLabel(data.stage)}`,
    data.budget ? `Budget: ${budgetLabel(data.budget)}` : '',
    data.message ? `Message: ${data.message}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function whatsappUrl(text: string) {
  const number = company.contact.whatsapp
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

function isSafeEndpoint(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export type SubmitChannel = 'api' | 'whatsapp' | 'email' | 'recorded'

export async function submitEnquiry(
  input: EnquiryInput,
): Promise<{ ok: true; channel: SubmitChannel; value: Enquiry } | { ok: false; errors: FieldErrors }> {
  if (input.website.trim()) {
    const phone = normalizePhone(input.phone) ?? '0000000000'
    return {
      ok: true,
      channel: 'recorded',
      value: {
        name: sanitizeText(input.name, 80) || 'Friend',
        phone,
        email: '',
        location: sanitizeText(input.location, 120),
        budget: '',
        stage: 'turnkey',
        message: '',
      },
    }
  }

  const { errors, value } = validateEnquiry(input)
  if (!value || Object.keys(errors).length) return { ok: false, errors }

  const endpoint = (import.meta.env.VITE_ENQUIRY_ENDPOINT ?? '').trim()
  if (endpoint && isSafeEndpoint(endpoint)) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(value),
      })
      if (!response.ok) {
        return { ok: false, errors: { form: 'The enquiry could not be sent. Please try again.' } }
      }
      return { ok: true, channel: 'api', value }
    } catch {
      return { ok: false, errors: { form: 'The enquiry could not be sent. Please check your connection and try again.' } }
    }
  }

  const wa = whatsappUrl(enquiryText(value))
  if (wa) {
    window.open(wa, '_blank', 'noopener,noreferrer')
    return { ok: true, channel: 'whatsapp', value }
  }

  if (company.contact.email) {
    const href = `mailto:${encodeURIComponent(company.contact.email)}?subject=${encodeURIComponent('New home enquiry')}&body=${encodeURIComponent(enquiryText(value))}`
    window.location.href = href
    return { ok: true, channel: 'email', value }
  }

  return { ok: true, channel: 'recorded', value }
}
