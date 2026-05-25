import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'aws-ai-practitioner-progress'

const defaultProgress = {
  flashcards: {},   // { [cardId]: 'learned' | 'review' | null }
  questions: {},    // { [questionId]: { correct: bool, attempts: number } }
  quizHistory: [],  // [{ date, score, total, domainId }]
  streak: 0,
  lastStudyDate: null,
  totalSessionTime: 0,
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    return { ...defaultProgress, ...JSON.parse(raw) }
  } catch {
    return defaultProgress
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage unavailable
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // Update streak on first load of the day
  useEffect(() => {
    const today = new Date().toDateString()
    if (progress.lastStudyDate !== today) {
      setProgress(p => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const wasYesterday = p.lastStudyDate === yesterday.toDateString()
        return {
          ...p,
          streak: wasYesterday ? p.streak + 1 : 1,
          lastStudyDate: today,
        }
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const markFlashcard = useCallback((cardId, status) => {
    setProgress(p => ({
      ...p,
      flashcards: { ...p.flashcards, [cardId]: status },
    }))
  }, [])

  const recordAnswer = useCallback((questionId, isCorrect) => {
    setProgress(p => {
      const existing = p.questions[questionId] || { correct: false, attempts: 0 }
      return {
        ...p,
        questions: {
          ...p.questions,
          [questionId]: {
            correct: existing.correct || isCorrect,
            attempts: existing.attempts + 1,
            lastCorrect: isCorrect,
          },
        },
      }
    })
  }, [])

  const saveQuizResult = useCallback((score, total, domainId) => {
    setProgress(p => ({
      ...p,
      quizHistory: [
        { date: new Date().toISOString(), score, total, domainId },
        ...p.quizHistory.slice(0, 49),
      ],
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress)
  }, [])

  // Derived stats
  const getStats = useCallback((questions, flashcards) => {
    const answeredQuestions = Object.values(progress.questions)
    const totalAnswered = answeredQuestions.length
    const totalCorrect = answeredQuestions.filter(q => q.correct).length
    const overallScore = totalAnswered > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0

    const learnedCards = Object.values(progress.flashcards).filter(s => s === 'learned').length

    const domainStats = {}
    questions.forEach(q => {
      if (!domainStats[q.domainId]) {
        domainStats[q.domainId] = { total: 0, correct: 0, answered: 0 }
      }
      domainStats[q.domainId].total++
      const record = progress.questions[q.id]
      if (record) {
        domainStats[q.domainId].answered++
        if (record.correct) domainStats[q.domainId].correct++
      }
    })

    return {
      totalAnswered,
      totalCorrect,
      overallScore,
      learnedCards,
      totalFlashcards: flashcards.length,
      domainStats,
      streak: progress.streak,
      quizHistory: progress.quizHistory,
    }
  }, [progress])

  const getWeakestDomain = useCallback((questions) => {
    const domainScores = {}
    questions.forEach(q => {
      if (!domainScores[q.domainId]) domainScores[q.domainId] = { total: 0, correct: 0 }
      domainScores[q.domainId].total++
      const record = progress.questions[q.id]
      if (record?.correct) domainScores[q.domainId].correct++
    })

    let weakest = null
    let lowestScore = Infinity
    Object.entries(domainScores).forEach(([id, stats]) => {
      const score = stats.total > 0 ? stats.correct / stats.total : 0
      if (score < lowestScore) {
        lowestScore = score
        weakest = parseInt(id)
      }
    })
    return weakest
  }, [progress])

  return {
    progress,
    markFlashcard,
    recordAnswer,
    saveQuizResult,
    resetProgress,
    getStats,
    getWeakestDomain,
  }
}
