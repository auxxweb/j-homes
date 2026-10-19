import { useEffect, useState } from 'react'
import { articles as bundledArticles, type JournalArticle } from '../data/journal'
import { cmsApi } from '../cms/CmsProvider'
import { subscribeCms } from '../cms/applyCms'
import { journalSnapshot, loadJournal } from './journalSheet'

export function useJournal() {
  const [articles, setArticles] = useState<JournalArticle[]>(cmsApi() ? bundledArticles : journalSnapshot)
  const [settled, setSettled] = useState(Boolean(cmsApi()))

  useEffect(() => {
    if (cmsApi()) {
      return subscribeCms(() => {
        setArticles(bundledArticles)
        setSettled(true)
      })
    }
    let cancel = false
    loadJournal().then((next) => {
      if (cancel) return
      setSettled(true)
      setArticles((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next))
    })
    return () => {
      cancel = true
    }
  }, [])

  return { articles, settled }
}
