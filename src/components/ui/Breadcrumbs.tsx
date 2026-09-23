import { Link } from 'react-router-dom'

export interface CrumbItem {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: CrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="label flex items-center gap-2 !text-[0.68rem]">
            {item.to ? (
              <Link to={item.to} className="hover:text-ink" data-cursor="explore">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
