import { useState, useEffect, useCallback } from 'react'
import { Clock, ChevronRight, RotateCcw, CheckCircle2, XCircle, Target, Timer } from 'lucide-react'
import { DOMAIN_COLORS } from '../data/domains'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ScoreRing({ score, size = 128 }) {
  const stroke = 10
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'
  const label = score >= 75 ? '¡Aprobado! 🎉' : score >= 50 ? 'Buen intento 📚' : 'Hay que repasar 💪'
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 absolute" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white leading-none">{score}<span className="text-2xl text-slate-400">%</span></span>
          <span className="text-slate-400 text-xs mt-1">puntuación</span>
        </div>
      </div>
      <p className="text-white font-bold mt-3 text-base">{label}</p>
    </div>
  )
}

function QuizTimer({ timeLeft, totalTime }) {
  const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100
  const isCrit = pct < 10
  const isWarn = pct < 30
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  return (
    <div className="flex items-center gap-3 mb-5">
      <Clock size={15} className={`flex-shrink-0 ${isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-slate-500'}`} />
      <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isCrit ? 'bg-red-500 animate-pulse' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
          role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}
          aria-label={`Tiempo restante: ${mins}:${secs}`}
        />
      </div>
      <span className={`font-mono text-sm font-bold min-w-[3.5rem] text-right ${isCrit ? 'text-red-400 animate-pulse' : isWarn ? 'text-amber-400' : 'text-slate-400'}`}>
        {mins}:{secs}
      </span>
    </div>
  )
}

function QuizSetup({ domains, onStart }) {
  const [domain, setDomain] = useState('all')
  const [count, setCount] = useState(10)
  const [timerOn, setTimerOn] = useState(false)

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <h1 className="page-title mb-2">Simulador de Examen</h1>
      <p className="text-slate-400 mb-8 text-sm">Configura tu sesión de práctica y empieza</p>

      {/* Domain */}
      <div className="card-solid p-5 mb-4">
        <h2 className="text-white font-bold mb-4 text-sm">Dominio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button onClick={() => setDomain('all')} aria-pressed={domain === 'all'}
            className={`p-4 rounded-xl border-2 text-left transition-all ${domain === 'all' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
            <span className="text-2xl" aria-hidden="true">🎯</span>
            <p className="text-white font-bold text-sm mt-1.5">Simulación completa</p>
            <p className="text-slate-500 text-xs">Todos los dominios, aleatorio</p>
          </button>
          {domains.map(d => {
            const active = domain === d.id
            const colors = DOMAIN_COLORS[d.color]
            return (
              <button key={d.id} onClick={() => setDomain(d.id)} aria-pressed={active}
                className={`p-4 rounded-xl border-2 text-left transition-all ${active ? `border-current ${colors.light}` : 'border-slate-700 hover:border-slate-600'}`}>
                <span className="text-2xl" aria-hidden="true">{d.icon}</span>
                <p className="text-white font-bold text-sm mt-1.5">{d.shortName}</p>
                <p className="text-slate-500 text-xs">{d.weight}% del examen</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Count + Timer */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="card-solid p-5">
          <h2 className="text-white font-bold mb-3 text-sm">Nº de preguntas</h2>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 20, 'Todas'].map(n => (
              <button key={n} onClick={() => setCount(n)} aria-pressed={count === n}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${count === n ? 'bg-amber-500 text-slate-900' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="card-solid p-5">
          <h2 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
            <Timer size={15} className="text-amber-400" /> Temporizador
          </h2>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={timerOn} onChange={e => setTimerOn(e.target.checked)} />
              <div className="w-10 h-6 bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-4" />
            </div>
            <div>
              <p className={`text-sm font-semibold ${timerOn ? 'text-amber-400' : 'text-slate-400'}`}>
                {timerOn ? 'Activado' : 'Desactivado'}
              </p>
              <p className="text-slate-600 text-xs">90 seg/pregunta</p>
            </div>
          </label>
        </div>
      </div>

      <button onClick={() => onStart(domain, count, timerOn)} className="w-full btn-primary justify-center py-3 text-base">
        Comenzar Quiz →
      </button>
    </div>
  )
}

function QuizQuestion({ question, domains, index, total, onAnswer, answered, selected }) {
  const domain = domains.find(d => d.id === question.domainId)
  const colors = domain ? DOMAIN_COLORS[domain.color] : DOMAIN_COLORS.blue

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <span className={`badge border ${colors.badge} text-xs`}>{domain?.icon} {domain?.shortName}</span>
        <span className="text-slate-500 text-xs">Pregunta {index + 1} de {total}</span>
      </div>

      <div className="h-1 bg-slate-800 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="card-solid p-5 mb-5">
        <p className="text-white font-medium leading-relaxed">{question.text}</p>
      </div>

      <fieldset>
        <legend className="sr-only">Elige tu respuesta</legend>
        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            let cls = 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/70'
            let letter = 'bg-slate-700 text-slate-400 border-slate-600'
            let indicator = null

            if (answered) {
              if (i === question.correct) {
                cls = 'border-emerald-500/50 bg-emerald-500/10'
                letter = 'bg-emerald-500 text-white border-emerald-500'
                indicator = <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              } else if (i === selected) {
                cls = 'border-red-500/50 bg-red-500/10'
                letter = 'bg-red-500 text-white border-red-500'
                indicator = <XCircle size={16} className="text-red-400 flex-shrink-0" />
              } else {
                cls = 'border-slate-700/40 bg-slate-800/20 opacity-50'
              }
            } else if (selected === i) {
              cls = 'border-amber-500/60 bg-amber-500/10'
              letter = 'bg-amber-500 text-slate-900 border-amber-500'
            }

            return (
              <button key={i} onClick={() => !answered && onAnswer(i)} disabled={answered}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${cls} ${!answered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'}`}
                aria-pressed={selected === i}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border flex-shrink-0 transition-all ${letter}`} aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-slate-200 leading-relaxed flex-1">{opt}</span>
                {indicator}
              </button>
            )
          })}
        </div>
      </fieldset>

      {answered && (
        <div className={`mt-5 p-4 rounded-2xl border ${selected === question.correct ? 'bg-emerald-500/8 border-emerald-500/25' : 'bg-amber-500/8 border-amber-500/25'}`}
          role="alert" aria-live="polite">
          <p className="font-bold text-sm text-white mb-1.5">
            {selected === question.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </p>
          <p className="text-slate-300 text-xs leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

function QuizSummary({ questions, answers, domains, onRetry, onNavigate }) {
  const correct = answers.filter((a, i) => a === questions[i].correct).length
  const score = Math.round((correct / questions.length) * 100)
  const passed = score >= 75
  const wrong = questions.filter((q, i) => answers[i] !== q.correct)
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <div className="animate-fade-up">
      {/* Score card */}
      <div className={`rounded-2xl p-8 text-center mb-6 border ${passed ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-slate-800/60 border-slate-700/50'}`}>
        <ScoreRing score={score} />
        <p className="text-slate-400 text-sm mt-3">
          <span className="text-white font-bold">{correct}</span> correctas · <span className="text-white font-bold">{questions.length - correct}</span> incorrectas
        </p>
        {passed
          ? <p className="text-emerald-400 text-xs mt-1.5">Nota de aprobado: 75% ✓</p>
          : <p className="text-slate-500 text-xs mt-1.5">Objetivo: 75% — te faltan {75 - score} puntos</p>
        }
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button onClick={onRetry} className="flex-1 btn-primary justify-center py-2.5">
          <RotateCcw size={15} /> Repetir
        </button>
        <button onClick={() => onNavigate('dashboard')} className="flex-1 btn-secondary justify-center py-2.5">
          Dashboard
        </button>
      </div>

      {/* Wrong answers */}
      {wrong.length > 0 && (
        <section aria-labelledby="review-title">
          <h2 id="review-title" className="section-title mb-4">
            Revisar respuestas incorrectas <span className="text-slate-500 font-normal text-sm">({wrong.length})</span>
          </h2>
          <div className="space-y-3">
            {wrong.map((q, wi) => {
              const yourAnswer = answers[questions.indexOf(q)]
              const domain = domains.find(d => d.id === q.domainId)
              const colors = domain ? DOMAIN_COLORS[domain.color] : DOMAIN_COLORS.blue
              const open = openIdx === wi

              return (
                <div key={q.id} className="card overflow-hidden">
                  <button onClick={() => setOpenIdx(open ? null : wi)}
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-700/20 transition-colors"
                    aria-expanded={open}>
                    <span className={`badge border ${colors.badge} text-xs flex-shrink-0 mt-0.5`}>{domain?.icon}</span>
                    <p className="text-slate-300 text-sm flex-1 leading-snug">{q.text}</p>
                    <ChevronRight size={15} className={`text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t border-slate-700/40 pt-3 space-y-2 animate-fade-up">
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correct
                        const isYours = oi === yourAnswer
                        if (!isCorrect && !isYours) return null
                        return (
                          <div key={oi} className={`flex items-start gap-2 p-2.5 rounded-xl text-xs ${isCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                            <span className="font-bold flex-shrink-0">{isCorrect ? '✓ Correcta:' : '✗ Tu respuesta:'}</span>
                            <span>{opt}</span>
                          </div>
                        )
                      })}
                      <div className="p-3 bg-slate-700/30 rounded-xl">
                        <p className="text-slate-400 text-xs leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export default function Quiz({ questions, domains, selectedDomain, progress, onRecord, onSaveResult, onNavigate }) {
  const [phase, setPhase] = useState('setup')
  const [quizQs, setQuizQs] = useState([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Timer
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft(s => {
      if (s <= 1) { handleNext(true); return 0 }
      return s - 1
    }), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft]) // eslint-disable-line

  function start(domainId, count, withTimer) {
    const pool = domainId === 'all' ? questions : questions.filter(q => q.domainId === domainId)
    const selected = shuffle(pool)
    const chosen = count === 'Todas' ? selected : selected.slice(0, Math.min(count, selected.length))
    setQuizQs(chosen)
    setIdx(0); setAnswers([]); setSelected(null); setAnswered(false)
    if (withTimer) {
      const t = chosen.length * 90
      setTotalTime(t); setTimeLeft(t); setTimerActive(true)
    } else {
      setTotalTime(0); setTimeLeft(0); setTimerActive(false)
    }
    setPhase('quiz')
  }

  function handleAnswer(opt) {
    setSelected(opt)
    setAnswered(true)
    onRecord(quizQs[idx].id, opt === quizQs[idx].correct)
  }

  const handleNext = useCallback((timeout = false) => {
    const ans = timeout ? (selected ?? -1) : selected
    const newAnswers = [...answers, ans]
    setAnswers(newAnswers)
    setSelected(null)
    setAnswered(false)

    if (idx < quizQs.length - 1) {
      setIdx(i => i + 1)
      if (timerActive) setTimeLeft(totalTime / quizQs.length)
    } else {
      setTimerActive(false)
      const correct = newAnswers.filter((a, i) => a === quizQs[i].correct).length
      onSaveResult(correct, quizQs.length, null)
      setPhase('summary')
    }
  }, [selected, answers, idx, quizQs, timerActive, totalTime]) // eslint-disable-line

  function reset() {
    setPhase('setup'); setTimerActive(false)
    setQuizQs([]); setIdx(0); setAnswers([])
    setSelected(null); setAnswered(false)
  }

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      {phase === 'setup' && <QuizSetup domains={domains} onStart={start} />}

      {phase === 'quiz' && quizQs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="page-title">Simulador</h1>
            <button onClick={reset} className="btn-ghost text-xs">← Configuración</button>
          </div>

          {timerActive && <QuizTimer timeLeft={timeLeft} totalTime={totalTime / quizQs.length} />}

          <QuizQuestion
            question={quizQs[idx]}
            domains={domains}
            index={idx}
            total={quizQs.length}
            onAnswer={handleAnswer}
            answered={answered}
            selected={selected}
          />

          {answered && (
            <button onClick={() => handleNext(false)} className="w-full btn-primary justify-center py-3 mt-6 text-base" autoFocus>
              {idx < quizQs.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'} →
            </button>
          )}
        </div>
      )}

      {phase === 'summary' && (
        <div>
          <h1 className="page-title mb-6">Resultados</h1>
          <QuizSummary
            questions={quizQs}
            answers={answers}
            domains={domains}
            onRetry={reset}
            onNavigate={onNavigate}
          />
        </div>
      )}
    </div>
  )
}
