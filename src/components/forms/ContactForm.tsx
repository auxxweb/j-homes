import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { company } from '../../data/company'
import { budgetOptions, isStageId, stages, type StageId } from '../../data/enquiry'
import { track } from '../../lib/analytics'
import { submitEnquiry, whatsappUrl, type FieldErrors, type SubmitChannel } from '../../lib/enquiry'
import { Button } from '../ui/Button'

const empty = {
  name: '',
  phone: '',
  email: '',
  location: '',
  budget: '',
  stage: '',
  message: '',
  website: '',
}

const successCopy: Record<SubmitChannel, string> = {
  api: 'Thank you. Your project enquiry has been sent. J Homes will use these details to understand the next step.',
  whatsapp: 'Thank you. WhatsApp is opening with your project note, ready to send to J Homes.',
  email: 'Thank you. Your email app is opening with the project note addressed to J Homes.',
  recorded:
    'Thank you. Your project details are noted on this page. A phone number has not been published on the site yet, so please keep a copy of what you entered.',
}

export function ContactForm() {
  const formId = useId()
  const [params] = useSearchParams()
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState<SubmitChannel | null>(null)

  useEffect(() => {
    const stage = params.get('stage') ?? ''
    if (isStageId(stage)) {
      setValues((current) => ({ ...current, stage }))
    }
  }, [params])

  const set =
    (key: keyof typeof empty) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
  }

  const chooseStage = (stage: StageId) => {
    setValues((current) => ({ ...current, stage }))
    setErrors((current) => ({ ...current, stage: undefined }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    const result = await submitEnquiry(values)
    setPending(false)
    if (!result.ok) {
      setErrors(result.errors)
      const first = Object.keys(result.errors)[0]
      if (first) document.getElementById(`${formId}-${first}`)?.focus()
      return
    }
    setErrors({})
    setDone(result.channel)
    track('enquiry_submit', { channel: result.channel })
  }

  if (done) {
    return (
      <div role="status" className="border-t border-line pt-8">
        <p className="font-serif text-4xl">Thank you.</p>
        <p className="mt-4 max-w-lg text-ink-soft">{successCopy[done]}</p>
        <dl className="mt-8 max-w-lg space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-line py-2">
            <dt className="label">Name</dt>
            <dd>{values.name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line py-2">
            <dt className="label">Location</dt>
            <dd>{values.location}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line py-2">
            <dt className="label">Stage</dt>
            <dd>{stages.find((stage) => stage.id === values.stage)?.label}</dd>
          </div>
        </dl>
      </div>
    )
  }

  const wa = whatsappUrl(company.whatsappMessage)

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="label mb-4">Where are you in the journey?</legend>
        {stages.map((stage) => {
          const selected = values.stage === stage.id
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => chooseStage(stage.id)}
              aria-pressed={selected}
              className={`border px-4 py-4 text-left text-sm transition-colors ${
                selected ? 'border-crimson bg-crimson text-white' : 'border-line hover:border-ink'
              }`}
            >
              {stage.label}
            </button>
          )
        })}
      </fieldset>
      {errors.stage && (
        <p id={`${formId}-stage-error`} className="mt-3 text-sm text-crimson-deep">
          {errors.stage}
        </p>
      )}

      {errors.form && (
        <p role="alert" className="mt-6 text-sm text-crimson-deep">
          {errors.form}
        </p>
      )}

      <div className="mt-10 grid gap-x-10 md:grid-cols-2">
        <Field id={`${formId}-name`} label="Name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" required />
        <Field id={`${formId}-phone`} label="Phone" value={values.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" required />
        <Field id={`${formId}-email`} label="Email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" type="email" />
        <Field id={`${formId}-location`} label="Location" value={values.location} onChange={set('location')} error={errors.location} autoComplete="address-level2" required />
        <label className="mt-6 block" htmlFor={`${formId}-budget`}>
          <span className="label">Approximate budget</span>
          <select id={`${formId}-budget`} className="field" value={values.budget} onChange={set('budget')}>
            <option value="">Prefer not to say yet</option>
            {budgetOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-6 block" htmlFor={`${formId}-stage`}>
          <span className="label">Current stage</span>
          <select
            id={`${formId}-stage`}
            className="field"
            value={values.stage}
            onChange={set('stage')}
            aria-invalid={Boolean(errors.stage)}
            aria-describedby={errors.stage ? `${formId}-stage-error` : undefined}
            required
          >
            <option value="">Select a stage</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-6 block" htmlFor={`${formId}-message`}>
        <span className="label">Message</span>
        <textarea id={`${formId}-message`} className="field min-h-32 resize-y" value={values.message} onChange={set('message')} />
      </label>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>
          Website
          <input id={`${formId}-website`} tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </label>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending}>
          {pending ? 'Sending' : 'Start my project'}
        </Button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="label text-crimson" data-cursor="explore" onClick={() => track('whatsapp_click')}>
            WhatsApp J Homes
          </a>
        )}
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  type = 'text',
  inputMode,
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
  autoComplete?: string
  type?: string
  inputMode?: 'tel' | 'email' | 'text'
  required?: boolean
}) {
  return (
    <label className="mt-6 block" htmlFor={id}>
      <span className="label">
        {label}
        {required ? '' : ' (optional)'}
      </span>
      <input
        id={id}
        className="field"
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
      />
      {error && (
        <span id={`${id}-error`} className="mt-2 block text-sm text-crimson-deep">
          {error}
        </span>
      )}
    </label>
  )
}
