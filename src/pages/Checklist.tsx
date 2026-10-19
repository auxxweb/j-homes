import { useEffect } from 'react'
import { RequirementChat } from '../components/checklist/RequirementChat'
import { Seo } from '../components/layout/Seo'
import { checklistPath } from '../lib/seo'

export default function ChecklistPage() {
  useEffect(() => {
    document.getElementById('preloader')?.remove()
  }, [])

  return (
    <>
      <Seo
        title="Requirement checklist | J Homes"
        description="Tell J Homes about the home you want. Answer a short chat and send your checklist."
        path={checklistPath()}
      />
      <RequirementChat page />
    </>
  )
}
