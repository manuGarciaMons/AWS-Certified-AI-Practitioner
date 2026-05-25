import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Flashcards from './components/Flashcards'
import Quiz from './components/Quiz'
import DomainSummary from './components/DomainSummary'
import Glossary from './components/Glossary'
import { useProgress } from './hooks/useProgress'
import { FLASHCARDS } from './data/flashcards'
import { QUESTIONS } from './data/questions'
import { DOMAINS } from './data/domains'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedDomain, setSelectedDomain] = useState(null)
  const progressHook = useProgress()

  function navigateTo(page, domainId = null) {
    setCurrentPage(page)
    setSelectedDomain(domainId)
    window.scrollTo(0, 0)
  }

  const stats = progressHook.getStats(QUESTIONS, FLASHCARDS)
  const weakestDomain = progressHook.getWeakestDomain(QUESTIONS)

  return (
    <Layout currentPage={currentPage} onNavigate={navigateTo} stats={stats}>
      {currentPage === 'dashboard' && (
        <Dashboard
          stats={stats}
          domains={DOMAINS}
          onNavigate={navigateTo}
          weakestDomain={weakestDomain}
        />
      )}
      {currentPage === 'flashcards' && (
        <Flashcards
          flashcards={FLASHCARDS}
          domains={DOMAINS}
          selectedDomain={selectedDomain}
          progress={progressHook.progress}
          onMark={progressHook.markFlashcard}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'quiz' && (
        <Quiz
          questions={QUESTIONS}
          domains={DOMAINS}
          selectedDomain={selectedDomain}
          progress={progressHook.progress}
          onRecord={progressHook.recordAnswer}
          onSaveResult={progressHook.saveQuizResult}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'glossary' && (
        <Glossary />
      )}
      {currentPage === 'domains' && (
        <DomainSummary
          domains={DOMAINS}
          selectedDomain={selectedDomain}
          stats={stats}
          onNavigate={navigateTo}
        />
      )}
    </Layout>
  )
}
