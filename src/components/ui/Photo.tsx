import type { Frame } from '../../data/media'

export function Photo({
  frame,
  className = '',
  priority = false,
}: {
  frame: Frame
  className?: string
  priority?: boolean
}) {
  return (
    <img
      src={frame.src}
      alt={frame.alt}
      width={frame.width}
      height={frame.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
