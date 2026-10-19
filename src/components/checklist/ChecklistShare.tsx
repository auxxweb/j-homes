import { useEffect, useRef, useState } from 'react'
import { company } from '../../data/company'
import { asset } from '../../lib/assets'
import { paintQr } from '../../lib/qr'
import { checklistUrl } from '../../lib/seo'

export function ChecklistShare({ qr = false }: { qr?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const url = checklistUrl()
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(qr)
  const [qrReady, setQrReady] = useState(false)

  useEffect(() => {
    if (!showQr || !canvasRef.current) return
    let cancelled = false
    paintQr(canvasRef.current, url, asset(company.logo.webp))
      .then(() => {
        if (!cancelled) setQrReady(true)
      })
      .catch(() => {
        if (!cancelled) setQrReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [showQr, url])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      return
    } catch {
      const field = document.createElement('textarea')
      field.value = url
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.left = '-9999px'
      document.body.appendChild(field)
      field.select()
      const copiedNow = document.execCommand('copy')
      field.remove()
      setCopied(copiedNow)
    }
  }

  function downloadQr() {
    const canvas = canvasRef.current
    if (!canvas || !qrReady) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'j-homes-checklist-qr.png'
    link.click()
  }

  return (
    <div>
      <p className="text-sm break-all text-ink-soft">{url}</p>
      <div className="mt-3 flex flex-col">
        <button type="button" className="dock-row" onClick={() => void copyLink()}>
          {copied ? 'Link copied' : 'Copy checklist link'}
        </button>
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
          <canvas ref={canvasRef} className="mx-auto block h-auto w-full max-w-[16rem]" aria-label="QR code for the J Homes requirement checklist" />
          <p className="mt-3 text-center text-[0.7rem] tracking-[0.14em] text-muted uppercase">Requirement checklist</p>
          {qrReady && (
            <button type="button" className="dock-row mt-3" onClick={downloadQr}>
              Download QR code
            </button>
          )}
        </div>
      )}
    </div>
  )
}
