import { useState, useEffect, useCallback } from 'react'
import { DOMAIN_COLORS } from '../data/domains'

export default function Flashcards({ flashcards, domains, selectedDomain, progress, onMark, onNavigate }) {
  const [activeDomain, setActiveDomain] = useState(selectedDomain || 'all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [filter, setFilter] = useState('all') // 'all' | 'learned' | 'review' | 'new'

  const filtered = flashcards.filter(card => {
    const domainMatch = activeDomain === 'all' || card.domainId === activeDomain
    const status = progress.flashcards[card.id]
    const statusMatch =
      filter === 'all' ||
      (filter === 'learned' && status === 'learned') ||
      (filter === 'review' && status === 'review') ||
      (filter === 'new' && !status)
    return domainMatch && statusMatch
  })

  const card = filtered[currentIndex]

  function goNext() {
    if (currentIndex < filtered.length - 1) {
      setFlipped(false)
      setTimeout(() => setCurrentIndex(i => i + 1), 150)
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setFlipped(false)
      setTimeout(() => setCurrentIndex(i => i - 1), 150)
    }
  }

  function handleFlip() {
    setFlipped(f => !f)
  }

  function handleMark(status) {
    if (card) {
      onMark(card.id, status)
      if (currentIndex < filtered.length - 1) {
        goNext()
      }
    }
  }

  const handleKey = useCallback((e) => {
    if (e.target.tagName === 'BUTTON' && e.key !== ' ') return
    switch (e.key) {
      case 'ArrowRight': goNext(); break
      case 'ArrowLeft': goPrev(); break
      case ' ':
        e.preventDefault()
        handleFlip()
        break
      default: break
    }
  }, [currentIndex, filtered.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Reset index when filter/domain changes
  useEffect(() => {
    setCurrentIndex(0)
    setFlipped(false)
  }, [activeDomain, filter])

  // Sync domain from props
  useEffect(() => {
    if (selectedDomain !== null) setActiveDomain(selectedDomain)
  }, [selectedDomain])

  const learnedCount = filtered.filter(c => progress.flashcards[c.id] === 'learned').length

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Flashcards</h1>
        <p className="text-gray-500 mt-1 text-sm">Press Space to flip • ← → to navigate • keyboard friendly</p>
      </div>

      {/* Domain tabs */}
      <div className="flex gap-2 flex-wrap mb-4" role="tablist" aria-label="Filter by domain">
        <button
          role="tab"
          aria-selected={activeDomain === 'all'}
          onClick={() => setActiveDomain('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeDomain === 'all'
              ? 'bg-aws-navy text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Domains
        </button>
        {domains.map(d => {
          const colors = DOMAIN_COLORS[d.color]
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={activeDomain === d.id}
              onClick={() => setActiveDomain(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeDomain === d.id
                  ? `${colors.bg} text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d.icon} {d.shortName}
            </button>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6" role="group" aria-label="Filter by status">
        {[
          { id: 'all', label: 'All' },
          { id: 'new', label: '⬜ New' },
          { id: 'review', label: '🔄 Review' },
          { id: 'learned', label: '✅ Learned' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filter === f.id
                ? 'bg-aws-navy text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 flex items-center">
          {learnedCount}/{filtered.length} learned
        </span>
      </div>

      {/* Progress bar */}
      {filtered.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Card {currentIndex + 1} of {filtered.length}</span>
            <span>{Math.round(((currentIndex + 1) / filtered.length) * 100)}% through deck</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-aws-orange rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={filtered.length}
            />
          </div>
        </div>
      )}

      {/* Card */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3" aria-hidden="true">🃏</p>
          <p className="text-gray-500 font-medium">No cards match your current filters.</p>
          <button onClick={() => setFilter('all')} className="btn-primary mt-4 mx-auto">
            Show all cards
          </button>
        </div>
      ) : (
        <>
          <div
            className="flip-card w-full cursor-pointer"
            style={{ height: '320px' }}
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Card answer (click to see question)' : 'Card question (click to reveal answer)'}
            onKeyDown={e => e.key === 'Enter' && handleFlip()}
          >
            <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
              {/* Front */}
              <div className="flip-card-front card p-8 flex flex-col justify-between bg-white">
                <div className="flex items-start justify-between">
                  {card && (
                    <span className={`badge ${DOMAIN_COLORS[domains.find(d => d.id === card.domainId)?.color || 'blue'].badge}`}>
                      {domains.find(d => d.id === card.domainId)?.icon} {domains.find(d => d.id === card.domainId)?.shortName}
                    </span>
                  )}
                  <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Question</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-4">
                  <p className="text-xl font-semibold text-gray-900 text-center leading-relaxed">
                    {card?.front}
                  </p>
                </div>
                <p className="text-center text-xs text-gray-400">Click or press Space to reveal answer</p>
              </div>

              {/* Back */}
              <div className="flip-card-back card p-8 flex flex-col justify-between bg-gradient-to-br from-aws-navy to-aws-navy-light text-white">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Answer</span>
                  {card && progress.flashcards[card.id] === 'learned' && (
                    <span className="badge bg-green-400/20 text-green-300">✅ Learned</span>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center py-4 overflow-y-auto">
                  <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-line text-left w-full">
                    {card?.back}
                  </p>
                </div>
                <p className="text-center text-xs text-gray-400">Click or press Space to flip back</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-5 gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous card"
            >
              ← Previous
            </button>

            {flipped && card && (
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handleMark('review')}
                  className="px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-sm transition-colors"
                  aria-label="Mark as needs review"
                >
                  🔄 Needs Review
                </button>
                <button
                  onClick={() => handleMark('learned')}
                  className="px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-800 font-semibold text-sm transition-colors"
                  aria-label="Mark as learned"
                >
                  ✅ Got It!
                </button>
              </div>
            )}

            <button
              onClick={goNext}
              disabled={currentIndex === filtered.length - 1}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next card"
            >
              Next →
            </button>
          </div>

          {/* Deck complete */}
          {currentIndex === filtered.length - 1 && learnedCount === filtered.length && filtered.length > 0 && (
            <div className="mt-6 card p-6 text-center bg-green-50 border border-green-200">
              <p className="text-2xl mb-2" aria-hidden="true">🎉</p>
              <p className="font-semibold text-green-800">You&apos;ve learned all {filtered.length} cards in this set!</p>
              <button
                onClick={() => onNavigate('quiz', typeof activeDomain === 'number' ? activeDomain : null)}
                className="btn-primary mt-3 mx-auto"
              >
                Test yourself in a quiz →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
