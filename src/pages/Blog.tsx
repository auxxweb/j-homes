import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { useJournal } from '../lib/useJournal'
import { readPage } from '../data/pageCopy'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function Blog() {
  const page = readPage('journal')
  const { articles } = useJournal()
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/blog' },
  ]
  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path="/blog"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Journal' },
        ]}
      />
      {articles.length > 0 ? (
        <section>
          <Container className="py-8 md:py-12">
            <ol>
              {articles.map((article, index) => (
                <li key={article.slug} className="border-t border-line py-8">
                  {article.kicker ? (
                    <p className="label">
                      {String(index + 1).padStart(2, '0')} / {article.kicker}
                    </p>
                  ) : null}
                  <h2 className={`max-w-3xl font-serif text-4xl ${article.kicker ? 'mt-3' : ''}`}>
                    <Link to={`/blog/${article.slug}`} className="hover:text-crimson" data-cursor="explore">
                      {article.title}
                    </Link>
                  </h2>
                  {article.description ? <p className="mt-3 max-w-2xl text-ink-soft">{article.description}</p> : null}
                </li>
              ))}
            </ol>
          </Container>
        </section>
      ) : null}
      <ClosingCta />
    </>
  )
}
