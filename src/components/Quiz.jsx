import { useState, useEffect } from 'react'
import { DOMAIN_COLORS } from '../data/domains'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function QuizSetup({ domains, onStart }) {
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [questionCount, setQuestionCount] = useState(10)

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Practice Quiz</h1>
      <p className="text-gray-500 mb-8">Choose your focus area and start practicing</p>

      <div className="card p-6 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Select Domain</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedDomain('all')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedDomain === 'all'
                ? 'border-aws-orange bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            aria-pressed={selectedDomain === 'all'}
          >
            <span className="text-2xl" aria-hidden="true">🎯</span>
            <p className="font-semibold text-gray-900 mt-1">Full Exam Simulation</p>
            <p className="text-xs text-gray-500">All 5 domains, weighted randomly</p>
          </button>
          {domains.map(d => {
            const colors = DOMAIN_COLORS[d.color]
            const active = selectedDomain === d.id
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  active
                    ? `border-current ${colors.light}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={active ? { borderColor: 'currentColor' } : {}}
                aria-pressed={active}
              >
                <span className="text-2xl" aria-hidden="true">{d.icon}</span>
                <p className="font-semibold text-gray-900 mt-1 text-sm">{d.shortName}</p>
                <p className="text-xs text-gray-500">{d.weight}% of exam</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Number of Questions</h2>
        <div className="flex gap-3 flex-wrap">
          {[5, 10, 20, 'All'].map(n => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
                questionCount === n
                  ? 'bg-aws-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={questionCount === n}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selectedDomain, questionCount)}
        className="w-full btn-primary justify-center py-3 text-base"
      >
        Start Quiz →
      </button>
    </div>
  )
}

function QuizQuestion({ question, domains, questionIndex, total, onAnswer, answered, selectedOption }) {
  const domain = domains.find(d => d.id === question.domainId)
  const colors = domain ? DOMAIN_COLORS[domain.color] : DOMAIN_COLORS.blue

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className={`badge ${colors.badge}`}>
          {domain?.icon} {domain?.shortName}
        </span>
        <span className="text-sm text-gray-500">Question {questionIndex + 1} of {total}</span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-aws-orange rounded-full transition-all"
          style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
          role="progressbar"
          aria-valuenow={questionIndex + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>

      {/* Question */}
      <div className="card p-6 mb-6">
        <p className="text-gray-900 font-medium leading-relaxed text-base">{question.text}</p>
      </div>

      {/* Options */}
      <fieldset>
        <legend className="sr-only">Select your answer</legend>
        <div className="space-y-3">
          {question.options.map((opt, i) => {
            let style = 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
            let indicator = null

            if (answered) {
              if (i === question.correct) {
                style = 'border-green-400 bg-green-50'
                indicator = <span className="ml-auto text-green-600 font-bold flex-shrink-0" aria-hidden="true">✓</span>
              } else if (i === selectedOption && i !== question.correct) {
                style = 'border-red-400 bg-red-50'
                indicator = <span className="ml-auto text-red-600 font-bold flex-shrink-0" aria-hidden="true">✗</span>
              } else {
                style = 'border-gray-200 bg-gray-50 opacity-70'
              }
            } else if (selectedOption === i) {
              style = 'border-aws-orange bg-orange-50'
            }

            return (
              <button
                key={i}
                onClick={() => !answered && onAnswer(i)}
                disabled={answered}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${style} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                aria-pressed={selectedOption === i}
              >
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  answered && i === question.correct
                    ? 'bg-green-500 text-white border-green-500'
                    : answered && i === selectedOption
                    ? 'bg-red-500 text-white border-red-500'
                    : selectedOption === i
                    ? 'bg-aws-orange text-white border-aws-orange'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`} aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-gray-800 leading-relaxed flex-1">{opt}</span>
                {indicator}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Explanation */}
      {answered && (
        <div className={`mt-5 p-4 rounded-xl border ${selectedOption === question.correct ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}
          role="alert"
          aria-live="polite"
        >
          <p className="font-semibold text-gray-900 mb-1">
            {selectedOption === question.correct ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

function QuizSummary({ questions, answers, domains, onRetry, onNavigate }) {
  const correct = answers.filter((a, i) => a === questions[i].correct).length
  const pct = Math.round((correct / questions.length) * 100)
  const passed = pct >= 75

  const wrongQuestions = questions.filter((q, i) => answers[i] !== q.correct)

  return (
    <div className="animate-fade-in">
      {/* Score card */}
      <div className={`card p-8 text-center mb-6 ${passed ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-aws-navy to-aws-navy-light'} text-white`}>
        <p className="text-5xl font-black mb-2">{pct}%</p>
        <p className="text-xl font-semibold mb-1">
          {passed ? '🎉 Great job!' : '📚 Keep studying!'}
        </p>
        <p className="text-white/80 text-sm">
          {correct} out of {questions.length} correct
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <span>✅ {correct} correct</span>
          <span>❌ {questions.length - correct} incorrect</span>
        </div>
        {passed && (
          <p className="mt-3 text-green-200 text-sm">Passing score: 75% ✓</p>
        )}
        {!passed && (
          <p className="mt-3 text-amber-200 text-sm">Target score: 75% (need {75 - pct}% more)</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button onClick={onRetry} className="flex-1 btn-primary justify-center">
          Try Again
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex-1 btn-secondary justify-center"
        >
          Dashboard
        </button>
      </div>

      {/* Wrong answers review */}
      {wrongQuestions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Review Incorrect Answers ({wrongQuestions.length})
          </h2>
          <div className="space-y-4">
            {wrongQuestions.map((q, i) => {
              const yourAnswer = answers[questions.indexOf(q)]
              const domain = domains.find(d => d.id === q.domainId)
              const colors = domain ? DOMAIN_COLORS[domain.color] : DOMAIN_COLORS.blue

              return (
                <div key={q.id} className="card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${colors.badge}`}>{domain?.icon} {domain?.shortName}</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-3 text-sm">{q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const isCorrect = oi === q.correct
                      const isYours = oi === yourAnswer
                      if (!isCorrect && !isYours) return null
                      return (
                        <div
                          key={oi}
                          className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                            isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                          }`}
                        >
                          <span className="font-bold flex-shrink-0">
                            {isCorrect ? '✓ Correct:' : '✗ Your answer:'}
                          </span>
                          <span>{opt}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Quiz({ questions, domains, selectedDomain, progress, onRecord, onSaveResult, onNavigate }) {
  const [phase, setPhase] = useState('setup') // 'setup' | 'quiz' | 'summary'
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [activeDomain, setActiveDomain] = useState(selectedDomain)

  useEffect(() => {
    if (selectedDomain !== null) {
      setActiveDomain(selectedDomain)
    }
  }, [selectedDomain])

  function startQuiz(domainId, count) {
    setActiveDomain(domainId === 'all' ? null : domainId)
    const pool = domainId === 'all'
      ? questions
      : questions.filter(q => q.domainId === domainId)
    const shuffled = shuffle(pool)
    const selected = count === 'All' ? shuffled : shuffled.slice(0, Math.min(count, shuffled.length))
    setQuizQuestions(selected)
    setCurrentIndex(0)
    setAnswers([])
    setSelectedOption(null)
    setAnswered(false)
    setPhase('quiz')
  }

  function handleAnswer(optionIndex) {
    setSelectedOption(optionIndex)
    setAnswered(true)
    const q = quizQuestions[currentIndex]
    const isCorrect = optionIndex === q.correct
    onRecord(q.id, isCorrect)
  }

  function handleNext() {
    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)
    setSelectedOption(null)
    setAnswered(false)

    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      const correct = newAnswers.filter((a, i) => a === quizQuestions[i].correct).length
      onSaveResult(correct, quizQuestions.length, activeDomain)
      setPhase('summary')
    }
  }

  function handleRetry() {
    setPhase('setup')
    setQuizQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setSelectedOption(null)
    setAnswered(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {phase === 'setup' && (
        <QuizSetup
          domains={domains}
          onStart={startQuiz}
        />
      )}

      {phase === 'quiz' && quizQuestions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
            <button
              onClick={handleRetry}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              ← Change settings
            </button>
          </div>

          <QuizQuestion
            question={quizQuestions[currentIndex]}
            domains={domains}
            questionIndex={currentIndex}
            total={quizQuestions.length}
            onAnswer={handleAnswer}
            answered={answered}
            selectedOption={selectedOption}
          />

          {answered && (
            <button
              onClick={handleNext}
              className="w-full btn-primary justify-center py-3 mt-6 text-base"
              autoFocus
            >
              {currentIndex < quizQuestions.length - 1 ? 'Next Question →' : 'See Results →'}
            </button>
          )}
        </div>
      )}

      {phase === 'summary' && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results</h1>
          <QuizSummary
            questions={quizQuestions}
            answers={answers}
            domains={domains}
            onRetry={handleRetry}
            onNavigate={onNavigate}
          />
        </div>
      )}
    </div>
  )
}
