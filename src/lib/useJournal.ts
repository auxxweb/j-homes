import { useEffect, useState } from 'react'
import type { JournalArticle } from '../data/journal'
import { journalSnapshot, loadJournal } from './journalSheet'

export function useJournal() {
  const [articles, setArticles] = useState<JournalArticle[]>(journalSnapshot)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
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
