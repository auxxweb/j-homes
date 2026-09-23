import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { articles } from '../data/journal'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function Blog() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/blog' },
  ]
  return (
    <>
      <Seo
        title="Journal | Building a Home with J Homes"
        description="Guides from J Homes on planning a house in Kochi, what turnkey construction includes, and the drawings behind a build."
        path="/blog"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        index="01"
        kicker="Journal"
        title="Notes on building a home."
        lede="Practical writing about the J Homes process. No invented news, no awards, no borrowed projects."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Journal' },
        ]}
      />
      <section>
        <Container className="py-8 md:py-12">
          <ol>
            {articles.map((article, index) => (
              <li key={article.slug} className="border-t border-line py-8">
                <p className="label">
                  {String(index + 1).padStart(2, '0')} / {article.kicker}
                </p>
                <h2 className="mt-3 max-w-3xl font-serif text-4xl">
                  <Link to={`/blog/${article.slug}`} className="hover:text-crimson" data-cursor="explore">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl text-ink-soft">{article.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <ClosingCta />
    </>
  )
}
