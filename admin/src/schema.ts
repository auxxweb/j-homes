export interface Field {
  path: string
  label: string
  type: 'text' | 'area' | 'number' | 'image' | 'list' | 'cards' | 'blocks' | 'images'
}

export interface CollectionSchema {
  id: string
  label: string
  hint: string
  fields: Field[]
}

const card: Field[] = [
  { path: 'title', label: 'Title', type: 'text' },
  { path: 'text', label: 'Text', type: 'area' },
  { path: 'image.src', label: 'Image', type: 'image' },
  { path: 'image.alt', label: 'Image description', type: 'text' },
]

export const collections: CollectionSchema[] = [
  {
    id: 'projects',
    label: 'Projects',
    hint: 'Project cards on the homepage and the Projects page.',
    fields: [
      { path: 'location', label: 'Location', type: 'text' },
      { path: 'region', label: 'Region', type: 'text' },
      { path: 'slug', label: 'Link name', type: 'text' },
      { path: 'floors', label: 'Floors', type: 'text' },
      { path: 'storeys', label: 'Storeys', type: 'number' },
      { path: 'builtUpSqFt', label: 'Built-up area (sq.ft)', type: 'number' },
      { path: 'landCent', label: 'Land (cents)', type: 'number' },
      { path: 'summary', label: 'Summary', type: 'area' },
      { path: 'story', label: 'Story', type: 'area' },
      { path: 'design', label: 'Design', type: 'area' },
      { path: 'construction', label: 'Construction', type: 'area' },
      { path: 'interior', label: 'Interior', type: 'area' },
      { path: 'result', label: 'Result', type: 'area' },
      { path: 'images', label: 'Photos', type: 'images' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    hint: 'Service pages and the steps shown across the site.',
    fields: [
      { path: 'title', label: 'Title', type: 'text' },
      { path: 'slug', label: 'Link name', type: 'text' },
      { path: 'headline', label: 'Headline', type: 'text' },
      { path: 'lede', label: 'Introduction', type: 'area' },
      { path: 'paragraphs', label: 'Paragraphs', type: 'list' },
      { path: 'points', label: 'Points', type: 'cards' },
      { path: 'includes', label: 'Includes', type: 'list' },
      { path: 'seoTitle', label: 'SEO title', type: 'text' },
      { path: 'seoDescription', label: 'SEO description', type: 'area' },
    ],
  },
  {
    id: 'journal',
    label: 'Journal',
    hint: 'Articles on the journal page.',
    fields: [
      { path: 'title', label: 'Title', type: 'text' },
      { path: 'slug', label: 'Link name', type: 'text' },
      { path: 'kicker', label: 'Kicker', type: 'text' },
      { path: 'description', label: 'Description', type: 'area' },
      { path: 'seoTitle', label: 'SEO title', type: 'text' },
      { path: 'blocks', label: 'Article', type: 'blocks' },
    ],
  },
  {
    id: 'gallery',
    label: 'Gallery',
    hint: 'Frames in the gallery and on the homepage.',
    fields: [
      { path: 'src', label: 'Image', type: 'image' },
      { path: 'alt', label: 'Description', type: 'area' },
    ],
  },
  {
    id: 'comparisons',
    label: 'Before and after',
    hint: 'Slider studies on the homepage and the before-and-after page.',
    fields: [
      { path: 'title', label: 'Title', type: 'text' },
      { path: 'beforeLabel', label: 'Before label', type: 'text' },
      { path: 'afterLabel', label: 'After label', type: 'text' },
      { path: 'before.src', label: 'Before image', type: 'image' },
      { path: 'before.alt', label: 'Before description', type: 'text' },
      { path: 'after.src', label: 'After image', type: 'image' },
      { path: 'after.alt', label: 'After description', type: 'text' },
    ],
  },
  { id: 'journey', label: 'Journey', hint: 'The eight stages on the homepage.', fields: [{ path: 'number', label: 'Number', type: 'text' }, ...card] },
  { id: 'process', label: 'Process steps', hint: 'The process page and homepage timeline.', fields: [{ path: 'number', label: 'Number', type: 'text' }, ...card] },
  { id: 'land', label: 'Land', hint: 'Land selection points.', fields: card },
  { id: 'drawings', label: 'Drawings', hint: 'Drawing types in the design section.', fields: [{ path: 'code', label: 'Code', type: 'text' }, { path: 'title', label: 'Title', type: 'text' }] },
  { id: 'approvals', label: 'Approvals', hint: 'The approval sequence.', fields: card },
  { id: 'construction', label: 'Construction', hint: 'Construction stages.', fields: [{ path: 'number', label: 'Number', type: 'text' }, ...card] },
  { id: 'interiors', label: 'Interiors', hint: 'Interior scopes and photos.', fields: card },
  { id: 'furniture', label: 'Furniture', hint: 'Furniture pieces and photos.', fields: card },
  { id: 'quality', label: 'Quality', hint: 'Quality points.', fields: card },
  { id: 'beyond', label: 'Beyond the build', hint: 'Landscape, gates and finishing cards.', fields: card },
  { id: 'hero', label: 'Hero frames', hint: 'The opening sequence on the homepage.', fields: [{ path: 'key', label: 'Key', type: 'text' }, { path: 'title', label: 'Title', type: 'text' }, { path: 'text', label: 'Text', type: 'area' }] },
  { id: 'design', label: 'Design photo', hint: 'The large design photograph.', fields: [{ path: 'title', label: 'Title', type: 'text' }, { path: 'image.src', label: 'Image', type: 'image' }, { path: 'image.alt', label: 'Description', type: 'text' }] },
]

export const contentGroups = [
  { title: 'Work', text: 'Projects, services and journal articles.', ids: ['projects', 'services', 'journal'] },
  { title: 'Pictures', text: 'Gallery frames, before-and-after studies and the design photograph.', ids: ['gallery', 'comparisons', 'design'] },
  { title: 'Homepage', text: 'The stages and cards on the home page.', ids: ['journey', 'hero', 'process', 'land', 'drawings', 'approvals', 'construction', 'interiors', 'furniture', 'quality', 'beyond'] },
]

export function schemaFor(id: string) {
  return collections.find((item) => item.id === id)
}

export function readPath(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object') return (current as Record<string, unknown>)[key]
    return undefined
  }, source)
}

export function writePath(source: Record<string, unknown>, path: string, value: unknown) {
  const next = structuredClone(source)
  const keys = path.split('.')
  let cursor: Record<string, unknown> = next
  keys.slice(0, -1).forEach((key) => {
    const child = cursor[key]
    if (!child || typeof child !== 'object') cursor[key] = {}
    cursor = cursor[key] as Record<string, unknown>
  })
  cursor[keys[keys.length - 1]] = value
  return next
}
