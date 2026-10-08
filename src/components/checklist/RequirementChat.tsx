import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLenis } from '../../hooks/useLenis'
import { checklistQuestions, visibleQuestions, type AnswerValue, type Answers, type Choice } from '../../data/checklist'
import { checklistPdf } from '../../lib/checklistPdf'
import { checklistEndpoint, submitChecklist } from '../../lib/checklistSubmit'

interface ChatMessage {
  id: number
  role: 'bot' | 'user'
  text: string
}

interface StepMark {
  step: number
  label: string
}

const greeting =
  'Hello. I’ll ask about the home you want, one question at a time. You can close this and come back — your answers stay until you leave the page.'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function nextIndex(answers: Answers, from: number) {
  for (let index = from; index < checklistQuestions.length; index += 1) {
    const question = checklistQuestions[index]
    if (!question.when || question.when(answers)) return index
  }
  return -1
}

export function RequirementChat() {
  const panelId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const lenis = useLenis()
  const idRef = useRef(3)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'bot', text: greeting },
    { id: 2, role: 'bot', text: checklistQuestions[0].prompt },
  ])
  const [step, setStep] = useState(0)
  const [trail, setTrail] = useState<StepMark[]>([])
  const [answers, setAnswers] = useState<Answers>({})
  const [draft, setDraft] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [finished, setFinished] = useState(false)
  const replyRef = useRef(0)
  const sendingRef = useRef(false)

  const question = step >= 0 ? checklistQuestions[step] : undefined
  const progress = useMemo(() => {
    const total = Math.max(visibleQuestions(answers).length, 1)
    return Math.min(100, Math.round((trail.length / total) * 100))
  }, [answers, trail.length])

  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('menu-lock')
    lenis?.stop()
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('menu-lock')
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [open, messages, thinking])

  useEffect(() => {
    if (!open || finished || thinking || !question) return
    if (question.kind !== 'choice' && question.kind !== 'multi') fieldRef.current?.focus()
  }, [open, finished, question, thinking])

  function push(role: ChatMessage['role'], text: string) {
    const id = idRef.current
    idRef.current += 1
    setMessages((current) => [...current, { id, role, text }])
  }

  function reply(text: string, after?: () => void) {
    const token = replyRef.current + 1
    replyRef.current = token
    setThinking(true)
    window.setTimeout(() => {
      if (replyRef.current !== token) return
      setThinking(false)
      push('bot', text)
      after?.()
    }, 780)
  }

  function commit(value: AnswerValue, label: string) {
    if (!question || thinking) return
    const nextAnswers = { ...answers, [question.id]: value }
    const following = nextIndex(nextAnswers, step + 1)
    setAnswers(nextAnswers)
    setTrail((current) => [...current, { step, label }])
    push('user', label)
    setDraft('')
    setPicked([])
    if (following === -1) {
      reply('That’s everything. Send it and we’ll file your checklist in Google Drive and on the sheet.', () => {
        setStep(-1)
        setFinished(false)
      })
      return
    }
    const next = checklistQuestions[following]
    reply(next.prompt, () => {
      setDraft(next.kind === 'date' ? today() : '')
      setStep(following)
    })
  }

  function submitText() {
    if (!question) return
    const value = draft.trim()
    if (!value) {
      if (question.optional) {
        commit('Skipped', 'Skipped')
        return
      }
      reply('Add that, then continue.')
      return
    }
    if (question.kind === 'phone' && value.replace(/\D/g, '').length < 10) {
      reply('Enter a contact number with at least 10 digits.')
      return
    }
    if (question.kind === 'number' && !/^\d+(\.\d+)?$/.test(value)) {
      reply('Use a number for that.')
      return
    }
    commit(value, value)
  }

  function onChip(option: Choice) {
    setPicked((current) => {
      if (option.exclusive) return current.includes(option.id) ? [] : [option.id]
      const cleared = current.filter((id) => !question?.options?.find((item) => item.id === id)?.exclusive)
      return cleared.includes(option.id) ? cleared.filter((id) => id !== option.id) : [...cleared, option.id]
    })
  }

  function submitMulti() {
    if (!question) return
    if (picked.length === 0) {
      reply('Choose at least one.')
      return
    }
    const label = picked.map((id) => question.options?.find((option) => option.id === id)?.label ?? id).join(', ')
    commit([...picked], label)
  }

  function goBack() {
    if (sending || thinking || trail.length === 0) return
    replyRef.current += 1
    setThinking(false)
    const previous = trail[trail.length - 1]
    const kept = trail.slice(0, -1)
    const nextAnswers = { ...answers }
    delete nextAnswers[checklistQuestions[previous.step].id]
    const rebuilt: ChatMessage[] = [{ id: 1, role: 'bot', text: greeting }]
    let id = 2
    for (const mark of kept) {
      rebuilt.push({ id, role: 'bot', text: checklistQuestions[mark.step].prompt })
      id += 1
      rebuilt.push({ id, role: 'user', text: mark.label })
      id += 1
    }
    rebuilt.push({ id, role: 'bot', text: checklistQuestions[previous.step].prompt })
    idRef.current = id + 1
    setMessages(rebuilt)
    setTrail(kept)
    setAnswers(nextAnswers)
    setStep(previous.step)
    setDraft(checklistQuestions[previous.step].kind === 'date' ? today() : '')
    setPicked([])
    setFinished(false)
  }

  function restart() {
    replyRef.current += 1
    sendingRef.current = false
    idRef.current = 3
    setThinking(false)
    setMessages([
      { id: 1, role: 'bot', text: greeting },
      { id: 2, role: 'bot', text: checklistQuestions[0].prompt },
    ])
    setStep(0)
    setTrail([])
    setAnswers({})
    setDraft('')
    setPicked([])
    setSending(false)
    setFinished(false)
  }

  async function send() {
    if (sendingRef.current || sending || thinking) return
    sendingRef.current = true
    setSending(true)
    setThinking(true)
    const submittedAt = new Date().toISOString()
    const pdf = checklistPdf(answers, submittedAt)
    let text = 'The connection failed. The checklist was not filed.'
    try {
      const result = await submitChecklist(answers, submittedAt, pdf)
      if (result.ok) {
        setFinished(true)
        text = result.mailed === false
          ? `Sent. Your checklist is in Google Drive and on the sheet. The email could not be sent. ${result.mailError || ''}`.trim()
          : 'Sent. Your checklist is in Google Drive, your answers are on the sheet, and J Homes has been emailed the PDF link.'
      } else {
        sendingRef.current = false
        text = checklistEndpoint()
          ? 'Google did not accept the checklist. It was not saved on this device.'
          : 'Google Drive is not connected yet, so the checklist was not filed.'
      }
    } catch {
      text = 'The connection failed. The checklist was not filed.'
      sendingRef.current = false
    } finally {
      setSending(false)
      setThinking(false)
      push('bot', text)
    }
  }

  const waiting = step >= 0 && !finished && !thinking
  const review = step < 0 && !finished

  return (
    <>
      {open &&
        createPortal(
        <section
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Client requirement checklist"
          data-lenis-prevent
          className="fixed inset-0 z-[80] flex flex-col bg-paper text-ink"
        >
          <header className="border-b border-line px-5 py-4 md:px-10">
            <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-4">
              <div>
                <p className="label text-crimson">J Homes</p>
                <h2 className="mt-1 font-serif text-4xl leading-none md:text-5xl">Requirement checklist</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex shrink-0 items-center gap-2 border border-ink px-3 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-ink uppercase"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
                Close
              </button>
            </div>
            <div className="mx-auto mt-4 w-full max-w-3xl">
              <p className="text-[0.68rem] tracking-[0.14em] text-muted uppercase">{question?.section ?? 'Review'}</p>
              <div className="mt-2 h-px bg-line">
                <div className="h-px bg-crimson" style={{ width: `${review || finished ? 100 : progress}%` }} />
              </div>
            </div>
          </header>
          <div ref={listRef} data-lenis-prevent className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 overflow-y-auto px-5 py-6 md:px-10">
            {messages.map((message) => (
              <p
                key={message.id}
                className={
                  message.role === 'bot'
                    ? 'chat-line max-w-[40rem] border border-line bg-paper-deep px-3 py-2 text-sm leading-relaxed text-ink-soft'
                    : 'chat-line ml-auto max-w-[32rem] bg-ink px-3 py-2 text-sm leading-relaxed text-paper'
                }
              >
                {message.text}
              </p>
            ))}
            {thinking && (
              <p className="chat-line flex w-fit items-center gap-2 border border-line bg-paper-deep px-4 py-3" aria-label={sending ? 'Sending' : 'Thinking'} role="status">
                <span className="chat-dot" />
                <span className="chat-dot chat-dot-2" />
                <span className="chat-dot chat-dot-3" />
                {sending ? <span className="text-sm text-ink-soft">Sending your checklist</span> : null}
              </p>
            )}
          </div>
          <footer className="border-t border-line px-5 py-4 md:px-10">
            <div className="mx-auto w-full max-w-3xl">
            {waiting && question && (question.kind === 'choice' || question.kind === 'multi') && (
              <div className="flex flex-wrap gap-2" data-lenis-prevent>
                {question.options?.map((option) => {
                  const selected = question.kind === 'multi' && picked.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`border px-3 py-2 text-left text-sm ${selected ? 'border-crimson text-crimson' : 'border-line text-ink'}`}
                      onClick={() => (question.kind === 'choice' ? commit(option.id, option.label) : onChip(option))}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            )}
            {waiting && question?.kind === 'multi' && (
              <button type="button" className="chat-send mt-3 px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase" onClick={submitMulti}>
                Continue
              </button>
            )}
            {waiting && question && (question.kind === 'text' || question.kind === 'phone' || question.kind === 'number') && (
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  submitText()
                }}
              >
                <input
                  ref={(node) => {
                    fieldRef.current = node
                  }}
                  value={draft}
                  placeholder={question.placeholder}
                  inputMode={question.kind === 'phone' ? 'tel' : question.kind === 'number' ? 'decimal' : 'text'}
                  className="min-w-0 flex-1 border border-line bg-paper px-3 py-2 text-sm text-ink outline-none"
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button type="submit" className="chat-send shrink-0 px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase">
                  Send
                </button>
              </form>
            )}
            {waiting && question?.kind === 'date' && (
              <form
                className="flex flex-wrap gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  submitText()
                }}
              >
                <input
                  ref={(node) => {
                    fieldRef.current = node
                  }}
                  type="date"
                  value={draft}
                  className="min-w-0 flex-1 border border-line bg-paper px-3 py-2 text-sm text-ink outline-none"
                  onChange={(event) => setDraft(event.target.value)}
                />
                <button type="submit" className="chat-send shrink-0 px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase">
                  Send
                </button>
                {question.optional && (
                  <button type="button" className="label border border-line px-3" onClick={() => commit('Not decided', 'Not decided')}>
                    Not decided
                  </button>
                )}
              </form>
            )}
            {waiting && question?.kind === 'note' && (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  submitText()
                }}
              >
                <textarea
                  ref={(node) => {
                    fieldRef.current = node
                  }}
                  value={draft}
                  rows={3}
                  className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none"
                  onChange={(event) => setDraft(event.target.value)}
                />
                <div className="mt-2 flex gap-2">
                  <button type="submit" className="chat-send px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase">
                    Send
                  </button>
                  {question.optional && (
                    <button type="button" className="label border border-line px-3 py-2" onClick={() => commit('Skipped', 'Skipped')}>
                      Skip
                    </button>
                  )}
                </div>
              </form>
            )}
            {waiting && question?.optional && question.kind !== 'note' && question.kind !== 'date' && (
              <button type="button" className="label mt-2 text-muted" onClick={() => commit('Skipped', 'Skipped')}>
                Skip
              </button>
            )}
            {review && (
              <button type="button" className="chat-send w-full px-4 py-3 text-[0.72rem] font-semibold tracking-[0.14em] uppercase" disabled={sending || thinking} onClick={send}>
                {sending ? 'Sending' : 'Send the checklist'}
              </button>
            )}
            <div className="mt-3 flex justify-between">
              <button type="button" className="label text-muted" disabled={trail.length === 0 || sending || thinking} onClick={goBack}>
                Back
              </button>
              <button type="button" className="label text-muted" onClick={restart}>
                Start again
              </button>
            </div>
            </div>
          </footer>
        </section>,
          document.body,
        )}
      <button
        type="button"
        className="dock-btn"
        data-cursor="explore"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open the requirement checklist"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="claw-mark">
          {!open && (
            <>
              <span className="claw-ring" />
              <span className="claw-ring claw-ring-late" />
            </>
          )}
          <ClawIcon />
        </span>
        <span>Checklist</span>
      </button>
    </>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.6">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function ClawIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.2rem] w-[1.2rem] text-crimson">
      <path
        fill="currentColor"
        d="M8.1 12.1c.6-4.2 4.4-7.2 8.4-6.6 1.7.2 3.2 1.3 4 2.8-2 .5-3.7 1.7-4.8 3.3-1.1-1-2.6-1.5-4.1-1.3-2 .3-3.5 1.8-3.8 3.7-.1.5-.1 1 0 1.5-1.8-.7-3-2.3-3-4.2 0-.9.3-1.8.8-2.5.5 1.4 1.6 2.5 2.5 3.3Z"
      />
      <path
        fill="currentColor"
        d="M8.4 13.2c1.2 3.8 5 6 8.6 4.6 1.6-.6 2.8-1.9 3.3-3.5-1.8.8-3.8.8-5.5 0-.8 1.4-2.1 2.4-3.6 2.7-2 .4-3.9-.7-4.7-2.4-.3-.6-.4-1.2-.4-1.8-1.6.7-2.6 2.2-2.6 3.9 0 .9.3 1.7.8 2.4-.5-1.6.1-3.3 1.5-4.3.5-.4 1.1-.6 1.7-.7.3.1.6.1.9.1Z"
      />
    </svg>
  )
}
