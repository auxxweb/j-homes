import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import { track } from '../../lib/analytics'
import { asset } from '../../lib/assets'
import { whatsappUrl } from '../../lib/enquiry'
import { paintQr } from '../../lib/qr'

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : null
}

export function ActionDock() {
  const panelId = useId()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const copyRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pageUrl, setPageUrl] = useState('')
  const [showQr, setShowQr] = useState(false)
  const [qrReady, setQrReady] = useState(false)
  const [socialNote, setSocialNote] = useState('')
  const whatsapp = whatsappUrl(company.whatsappMessage)
  const call = telHref(company.contact.phone)

  useEffect(() => {
    if (!open) return
    setPageUrl(window.location.href)
    copyRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!document.getElementById(panelId)?.contains(target) && !document.getElementById(`${panelId}-button`)?.contains(target)) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open, panelId])

  useEffect(() => {
    if (!open || !showQr || !pageUrl || !canvasRef.current) return
    let cancelled = false
    paintQr(canvasRef.current, pageUrl, asset(company.logo.webp))
      .then(() => {
        if (!cancelled) setQrReady(true)
      })
      .catch(() => {
        if (!cancelled) setQrReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, pageUrl, showQr])

  const shareText = 'J Homes — from first step to final finish.'

  async function copyLink() {
    if (!pageUrl) return
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      track('share_copy')
    } catch {
      setCopied(false)
    }
  }

  function downloadQr() {
    const canvas = canvasRef.current
    if (!canvas || !qrReady) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'j-homes-qr.png'
    link.click()
    track('share_qr_download')
  }

  async function shareSocial() {
    if (!pageUrl) return
    const payload = { title: 'J Homes', text: shareText, url: pageUrl }
    if (navigator.share) {
      try {
        await navigator.share(payload)
        setSocialNote('')
        track('share_social')
      } catch {
        /* dismissed */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${pageUrl}`)
      setSocialNote('Link copied. Paste it into WhatsApp, Facebook or X.')
      track('share_social')
    } catch {
      setSocialNote('Sharing is not available in this browser.')
    }
  }

  return (
    <div className="fixed top-1/2 right-3 z-40 flex -translate-y-1/2 flex-col gap-2 md:right-5">
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-btn"
          data-cursor="explore"
          aria-label="WhatsApp J Homes"
          onClick={() => track('whatsapp_click')}
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
      ) : (
        <Link to="/contact" className="dock-btn" data-cursor="explore" aria-label="WhatsApp J Homes">
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </Link>
      )}
      {call ? (
        <a href={call} className="dock-btn" data-cursor="explore" aria-label={`Call ${company.contact.phoneDisplay}`}>
          <PhoneIcon />
          <span>Call</span>
        </a>
      ) : (
        <Link to="/contact" className="dock-btn" data-cursor="explore" aria-label="Call J Homes">
          <PhoneIcon />
          <span>Call</span>
        </Link>
      )}
      <a
        href={asset('/brochure/j-homes-brochure.pdf')}
        download="J-Homes-Brochure.pdf"
        className="dock-btn"
        data-cursor="explore"
        aria-label="Download the J Homes brochure"
        onClick={() => track('brochure_download')}
      >
        <DownloadIcon />
        <span>Brochure</span>
      </a>
      <div className="relative">
        <button
          id={`${panelId}-button`}
          type="button"
          className="dock-btn w-full"
          aria-label="Share this page"
          aria-expanded={open}
          aria-controls={panelId}
          data-cursor="explore"
          onClick={() => {
            setOpen((value) => !value)
            setCopied(false)
          }}
        >
          <ShareIcon />
          <span>Share</span>
        </button>
        {open &&
          createPortal(
            <>
              <button
                type="button"
                className="fixed inset-0 z-50 bg-ink/35"
                aria-label="Close share"
                onClick={() => setOpen(false)}
              />
              <div
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label="Share this page"
                className="fixed z-[60] max-h-[min(40rem,calc(100svh-5.5rem))] overflow-y-auto border border-line bg-paper p-5 text-ink inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[min(24rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 md:left-auto md:right-44 md:translate-x-0"
              >
                <p className="label">Share</p>
                <div className="mt-4 flex flex-col">
                  <button ref={copyRef} type="button" className="dock-row" onClick={copyLink}>
                    {copied ? 'Link copied' : 'Copy link'}
                  </button>
                  <button type="button" className="dock-row" onClick={shareSocial}>
                    Share on social
                  </button>
                  {socialNote && <p className="py-3 text-sm text-ink-soft">{socialNote}</p>}
                  <button
                    type="button"
                    className="dock-row"
                    aria-expanded={showQr}
                    onClick={() => {
                      setShowQr((value) => !value)
                      setQrReady(false)
                    }}
                  >
                    {showQr ? 'Hide QR code' : 'QR code'}
                  </button>
                </div>
                {showQr && (
                  <div className="mt-4 border border-line bg-paper p-3">
                    <canvas ref={canvasRef} className="mx-auto block h-auto w-full max-w-[16rem]" aria-label="QR code for this J Homes page, with the J Homes logo in the centre" />
                    <p className="mt-3 text-center text-[0.7rem] tracking-[0.14em] text-muted uppercase">J Homes</p>
                    {qrReady && (
                      <button type="button" className="dock-row mt-3" onClick={downloadQr}>
                        Download QR code
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>,
            document.body,
          )}
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
      <path d="M4.5 6.5h15V16H10l-3.2 2.8V16H4.5V6.5Z" />
      <path d="M8 10.2h8M8 13h5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
      <path d="M7 3.5h3.2l1.2 3.1-2 1.2a12.5 12.5 0 0 0 5.8 5.8l1.2-2 3.1 1.2V17a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5 6.7 2 2 0 0 1 7 3.5Z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
      <path d="M12 4v11" />
      <path d="M7.5 11.5 12 16l4.5-4.5" />
      <path d="M5 19h14" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="17" cy="6.5" r="2.2" />
      <circle cx="17" cy="17.5" r="2.2" />
      <path d="M8 11.1 14.8 7.6M8.1 13.1l6.7 3.4" />
    </svg>
  )
}
