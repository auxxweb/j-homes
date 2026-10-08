import { Link, useParams } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { absoluteUrl, breadcrumbLd, graphLd } from '../lib/seo'
import { useJournal } from '../lib/useJournal'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug = '' } = useParams()
  const { articles, settled } = useJournal()
  const article = articles.find((item) => item.slug === slug)
  if (!article) return settled ? <NotFound /> : null
  const path = `/blog/${article.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/blog' },
    ...(article.kicker ? [{ name: article.kicker, path }] : []),
  ]
  const more = articles.filter((item) => item.slug !== article.slug && item.title)
  const description = article.description || article.title

  return (
    <>
      <Seo
        title={article.seoTitle || article.title}
        description={description}
        path={path}
        jsonLd={graphLd([
          {
            '@type': 'Article',
            headline: article.title,
            ...(article.description ? { description: article.description } : {}),
            author: { '@type': 'Organization', name: 'J Homes' },
            publisher: { '@type': 'Organization', name: 'J Homes' },
            mainEntityOfPage: absoluteUrl(path),
          },
          breadcrumbLd(crumbs),
        ])}
      />
      <PageHero
        kicker={article.kicker || undefined}
        title={article.title}
        lede={article.description || undefined}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Journal', to: '/blog' },
          ...(article.kicker ? [{ label: article.kicker }] : []),
        ]}
      />
      <article>
        <Container className="max-w-3xl py-14 md:py-20">
          {article.blocks.map((block, index) =>
            block.type === 'h2' ? (
              <h2 key={`${block.type}-${index}`} className="mt-12 font-serif text-3xl">
                {block.text}
              </h2>
            ) : (
              <p key={`${block.type}-${index}`} className="mt-5 text-lg text-ink-soft">
                {block.text}
              </p>
            ),
          )}
          <p className="mt-10">
            <Link to="/contact" className="label text-crimson" data-cursor="explore">
              Start your project
            </Link>
          </p>
        </Container>
      </article>
      {more.length > 0 ? (
        <section className="border-t border-line">
          <Container className="py-12">
            <p className="label">More guides</p>
            <ul className="mt-4 space-y-3">
              {more.map((item) => (
                <li key={item.slug}>
                  <Link to={`/blog/${item.slug}`} className="font-serif text-2xl hover:text-crimson">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
      <ClosingCta />
    </>
  )
}
