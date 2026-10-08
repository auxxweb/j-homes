import { useCallback, useState } from 'react'
import { gallery } from '../../data/media'
import { ImageViewer } from '../ui/ImageViewer'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Gallery() {
  return (
    <section id="gallery" className="border-t border-line bg-paper">
      <Container className="pt-20 pb-8 md:pt-28">
        <SectionLabel label="Gallery" />
        <h2 className="display-2 mt-5 max-w-4xl">
          A closer
          <span className="block">look.</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          Open any frame to see it larger, then move through the set.
        </p>
      </Container>
      <Container className="pb-20 md:pb-28">
        <GalleryFrames />
      </Container>
    </section>
  )
}

export function GalleryFrames() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {gallery.map((item, index) => (
          <li key={item.src} className={spanFor(index)}>
            <button
              type="button"
              className="block w-full overflow-hidden text-left"
              data-cursor="view"
              onClick={() => setOpen(index)}
            >
              <Photo frame={item} className="aspect-[4/3] w-full object-cover" />
              <span className="label mt-3 block">{String(index + 1).padStart(2, '0')}</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <ImageViewer images={gallery} index={open} onChange={setOpen} onClose={close} />}
    </>
  )
}

function spanFor(index: number) {
  const pattern = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4']
  return pattern[index % pattern.length]
}
