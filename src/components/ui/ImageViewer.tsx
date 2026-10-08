import { useEffect, useId, useRef } from 'react'
import { useLenis } from '../../hooks/useLenis'

export interface ViewImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export function ImageViewer({
  images,
  index,
  onChange,
  onClose,
}: {
  images: ViewImage[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()
  const frame = images[index]
  const last = images.length - 1

  useEffect(() => {
    closeRef.current?.focus()
    document.documentElement.classList.add('menu-lock')
    lenis?.stop()
    return () => {
      document.documentElement.classList.remove('menu-lock')
      lenis?.start()
    }
  }, [lenis])

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (images.length < 2) return
      if (event.key === 'ArrowRight') onChange(index === last ? 0 : index + 1)
      if (event.key === 'ArrowLeft') onChange(index === 0 ? last : index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, index, last, onChange, onClose])

  if (!frame) return null

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-night/95 text-paper" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <p id={titleId} className="label !text-paper/70">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </p>
        <button ref={closeRef} type="button" className="label !text-paper" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-8">
        <img
          src={frame.src}
          alt={frame.alt}
          width={frame.width}
          height={frame.height}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        {images.length > 1 ? (
          <button type="button" className="label !text-paper" onClick={() => onChange(index === 0 ? last : index - 1)}>
            Previous
          </button>
        ) : (
          <span />
        )}
        <p className="hidden max-w-md text-center text-sm text-paper/70 sm:block">{frame.alt}</p>
        {images.length > 1 ? (
          <button type="button" className="label !text-paper" onClick={() => onChange(index === last ? 0 : index + 1)}>
            Next
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
