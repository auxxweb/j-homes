import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const envPath = resolve(root, '.env')
let siteUrl = process.env.VITE_SITE_URL ?? ''

if (!siteUrl && existsSync(envPath)) {
  const match = readFileSync(envPath, 'utf8').match(/^VITE_SITE_URL=(.*)$/m)
  siteUrl = match?.[1]?.trim() ?? ''
}

siteUrl = siteUrl.replace(/\/$/, '')

const paths = [
  '/',
  '/about',
  '/services',
  '/services/house-construction',
  '/services/architectural-design',
  '/services/interior-design',
  '/services/turnkey-construction',
  '/services/land-selection',
  '/services/engineering',
  '/projects',
  '/projects/mulanthuruthy-residence',
  '/projects/mulanthuruthy-g1-residence',
  '/projects/eruveli-residence',
  '/projects/thiruvaniyoor-residence',
  '/projects/changanassery-residence',
  '/projects/chottanikkara-residence',
  '/process',
  '/before-after',
  '/contact',
  '/blog',
  '/blog/planning-a-home-in-kochi',
  '/blog/what-a-turnkey-home-includes',
  '/blog/drawings-that-guide-a-build',
]

if (!siteUrl) {
  console.log('Sitemap skipped. Set VITE_SITE_URL to emit dist/sitemap.xml.')
  process.exit(0)
}

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}
</urlset>
`

writeFileSync(resolve(root, 'dist/sitemap.xml'), body)
const robotsPath = resolve(root, 'dist/robots.txt')
const robots = existsSync(robotsPath) ? readFileSync(robotsPath, 'utf8').trim() : 'User-agent: *\nAllow: /'
if (!robots.includes('Sitemap:')) {
  writeFileSync(robotsPath, `${robots}\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
}
console.log(`Wrote sitemap for ${siteUrl}`)
