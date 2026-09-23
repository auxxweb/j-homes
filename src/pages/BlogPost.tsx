import { Link, useParams } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { articles, getArticle } from '../data/journal'
import { absoluteUrl, breadcrumbLd, graphLd } from '../lib/seo'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)
  if (!article) return <NotFound />
  const path = `/blog/${article.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/blog' },
    { name: article.title, path },
  ]
  const more = articles.filter((item) => item.slug !== article.slug)

  return (
    <>
      <Seo
        title={article.seoTitle}
        description={article.description}
        path={path}
        jsonLd={graphLd([
          {
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            author: { '@type': 'Organization', name: 'J Homes' },
            publisher: { '@type': 'Organization', name: 'J Homes' },
            mainEntityOfPage: absoluteUrl(path),
          },
          breadcrumbLd(crumbs),
        ])}
      />
      <PageHero
        index="02"
        kicker={article.kicker}
        title={article.title}
        lede={article.description}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Journal', to: '/blog' },
          { label: 'Guide' },
        ]}
      />
      <article>
        <Container className="max-w-3xl py-14 md:py-20">
          {article.blocks.map((block) =>
            block.type === 'h2' ? (
              <h2 key={block.text} className="mt-12 font-serif text-3xl">
                {block.text}
              </h2>
            ) : (
              <p key={block.text} className="mt-5 text-lg text-ink-soft">
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
      <ClosingCta />
    </>
  )
}
