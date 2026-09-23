import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { gallery } from '../../data/media'
import { useLenis } from '../../hooks/useLenis'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="gallery" className="border-t border-line bg-paper">
      <Container className="pt-20 pb-8 md:pt-28">
        <SectionLabel index="11" label="Gallery" />
        <h2 className="display-2 mt-5 max-w-4xl">
          A closer
          <span className="block">look.</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          Elevation studies, shown in full. Open any frame to move through the set.
        </p>
      </Container>
      <Container className="pb-20 md:pb-28">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {gallery.map((item, index) => (
            <li key={item.src} className={spanFor(index)}>
              <button
                type="button"
                className="block w-full text-left"
                data-cursor="view"
                onClick={() => setOpen(index)}
              >
                <Photo frame={item} className="h-auto w-full" />
                <span className="label mt-3 block">{String(index + 1).padStart(2, '0')}</span>
              </button>
            </li>
          ))}
        </ul>
      </Container>
      {open !== null && <Viewer index={open} onChange={setOpen} onClose={close} />}
    </section>
  )
}

function spanFor(index: number) {
  const pattern = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4']
  return pattern[index % pattern.length]
}

function Viewer({
  index,
  onChange,
  onClose,
}: {
  index: number
  onChange: (index: number) => void
  onClose: () => void
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()
  const frame = gallery[index]
  const last = gallery.length - 1

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
      if (event.key === 'ArrowRight') onChange(index === last ? 0 : index + 1)
      if (event.key === 'ArrowLeft') onChange(index === 0 ? last : index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, last, onChange, onClose])

  if (!frame) return null

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-night/95 text-paper" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <p id={titleId} className="label !text-paper/70">
          {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
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
        <button
          type="button"
          className="label !text-paper"
          onClick={() => onChange(index === 0 ? last : index - 1)}
        >
          Previous
        </button>
        <p className="hidden max-w-md text-center text-sm text-paper/70 sm:block">{frame.alt}</p>
        <button
          type="button"
          className="label !text-paper"
          onClick={() => onChange(index === last ? 0 : index + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
