import { useState, useEffect, useCallback } from 'react'
import { Clock, ChevronRight, RotateCcw, CheckCircle2, XCircle, Target, Timer, ArrowLeft } from 'lucide-react'
import { DOMAIN_COLORS } from '../data/domains'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ScoreRing({ score, size = 140 }) {
  const stroke = 10
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'
  const glow = score >= 75 ? 'rgba(16,185,129,0.3)' : score >= 50 ? 'rgba(245,158,11,0.3)' : 'rgba(244,63,94,0.3)'
  const label = score >= 75 ? '¡Aprobado!' : score >= 50 ? 'Buen intento' : 'Hay que repasar'
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 absolute" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            className="transition-all duration-1000" style={{ filter: `drop-shadow(0 0 8px ${glow})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white leading-none">{score}<span className="text-xl text-slate-500">%</span></span>
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
      <Clock size={15} className={`flex-shrink-0 ${isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-slate-600'}`} />
      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isCrit ? 'bg-red-500 animate-pulse' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%`, boxShadow: `0 0 8px ${isCrit ? 'rgba(239,68,68,0.3)' : isWarn ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}` }}
          role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}
          aria-label={`Tiempo restante: ${mins}:${secs}`}
        />
      </div>
      <span className={`font-mono text-sm font-bold min-w-[3.5rem] text-right ${isCrit ? 'text-red-400 animate-pulse' : isWarn ? 'text-amber-400' : 'text-slate-500'}`}>
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
          <span className="gradient-text">Simulador</span>
          <span className="text-white"> de Examen</span>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm font-medium">Configura tu sesión de práctica y empieza</p>
      </div>

      {/* Domain */}
      <div className="card p-5 mb-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <h2 className="text-white font-bold mb-4 text-sm">Dominio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button onClick={() => setDomain('all')} aria-pressed={domain === 'all'}
            className={`p-4 rounded-xl border transition-all duration-200 text-left ${domain === 'all' ? 'border-amber-500/40 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04]'}`}>
            <span className="text-2xl" aria-hidden="true">🎯</span>
            <p className="text-white font-bold text-sm mt-1.5">Simulación completa</p>
            <p className="text-slate-600 text-xs">Todos los dominios, aleatorio</p>
          </button>
          {domains.map(d => {
            const active = domain === d.id
            return (
              <button key={d.id} onClick={() => setDomain(d.id)} aria-pressed={active}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${active ? 'border-amber-500/40 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                <span className="text-2xl" aria-hidden="true">{d.icon}</span>
                <p className="text-white font-bold text-sm mt-1.5">{d.shortName}</p>
                <p className="text-slate-600 text-xs">{d.weight}% del examen</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Count + Timer */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6 animate-fade-up" style={{ animationDelay: '160ms' }}>
        <div className="card p-5">
          <h2 className="text-white font-bold mb-3 text-sm">Nº de preguntas</h2>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 20, 'Todas'].map(n => (
              <button key={n} onClick={() => setCount(n)} aria-pressed={count === n}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${count === n ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-white/[0.06]'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
            <Timer size={15} className="text-amber-400" /> Temporizador
          </h2>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={timerOn} onChange={e => setTimerOn(e.target.checked)} />
              <div className="w-10 h-6 bg-white/[0.06] rounded-full peer-checked:bg-amber-500 transition-all peer-checked:shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-4" />
            </div>
            <div>
              <p className={`text-sm font-semibold ${timerOn ? 'text-amber-400' : 'text-slate-500'}`}>
                {timerOn ? 'Activado' : 'Desactivado'}
              </p>
              <p className="text-slate-600 text-xs">90 seg/pregunta</p>
            </div>
          </label>
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
        <button onClick={() => onStart(domain, count, timerOn)} className="w-full btn-primary justify-center py-3 text-base">
          Comenzar Quiz →
        </button>
      </div>
    </div>
  )
}

function QuizQuestion({ question, domains, index, total, onAnswer, answered, selected }) {
  const domain = domains.find(d => d.id === question.domainId)
  const colors = domain ? DOMAIN_COLORS[domain.color] : DOMAIN_COLORS.blue

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <span className={`badge border ${colors.badge} text-[10px]`}>{domain?.icon} {domain?.shortName}</span>
        <span className="text-slate-600 text-xs font-medium">Pregunta {index + 1} de {total}</span>
      </div>

      <div className="h-1 bg-white/[0.04] rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all shadow-[0_0_8px_rgba(245,158,11,0.3)]"
          style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="card p-5 mb-5">
        <p className="text-white font-medium leading-relaxed">{question.text}</p>
      </div>

      <fieldset>
        <legend className="sr-only">Elige tu respuesta</legend>
        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            let cls = 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
            let letter = 'bg-white/[0.06] text-slate-500 border-white/[0.08]'
            let indicator = null

            if (answered) {
              if (i === question.correct) {
                cls = 'border-emerald-500/40 bg-emerald-500/[0.08]'
                letter = 'bg-emerald-500 text-white border-emerald-500'
                indicator = <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              } else if (i === selected) {
                cls = 'border-red-500/40 bg-red-500/[0.08]'
                letter = 'bg-red-500 text-white border-red-500'
                indicator = <XCircle size={16} className="text-red-400 flex-shrink-0" />
              } else {
                cls = 'border-white/[0.03] bg-transparent opacity-40'
              }
            } else if (selected === i) {
              cls = 'border-amber-500/40 bg-amber-500/[0.06] shadow-[0_0_16px_rgba(245,158,11,0.08)]'
              letter = 'bg-amber-500 text-slate-950 border-amber-500'
            }

            return (
              <button key={i} onClick={() => !answered && onAnswer(i)} disabled={answered}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${cls} ${!answered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'}`}
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
        <div className={`mt-5 p-4 rounded-2xl border ${selected === question.correct ? 'bg-emerald-500/[0.06] border-emerald-500/20' : 'bg-amber-500/[0.06] border-amber-500/20'}`}
          role="alert" aria-live="polite">
          <p className="font-bold text-sm text-white mb-1.5">
            {selected === question.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">{question.explanation}</p>
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
      <div className={`rounded-2xl p-8 text-center mb-6 border ${passed ? 'bg-emerald-500/[0.06] border-emerald-500/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
        <ScoreRing score={score} />
        <p className="text-slate-400 text-sm mt-3">
          <span className="text-white font-bold">{correct}</span> correctas · <span className="text-white font-bold">{questions.length - correct}</span> incorrectas
        </p>
        {passed
          ? <p className="text-emerald-400 text-xs mt-1.5 font-medium">Nota de aprobado: 75% ✓</p>
          : <p className="text-slate-600 text-xs mt-1.5 font-medium">Objetivo: 75% — te faltan {75 - score} puntos</p>
        }
      </div>

      <div className="flex gap-3 mb-8">
        <button onClick={onRetry} className="flex-1 btn-primary justify-center py-2.5">
          <RotateCcw size={15} /> Repetir
        </button>
        <button onClick={() => onNavigate('dashboard')} className="flex-1 btn-secondary justify-center py-2.5">
          Dashboard
        </button>
      </div>

      {wrong.length > 0 && (
        <section aria-labelledby="review-title">
          <h2 id="review-title" className="section-title mb-4">
            Revisar incorrectas <span className="text-slate-600 font-normal text-sm">({wrong.length})</span>
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
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                    aria-expanded={open}>
                    <span className={`badge border ${colors.badge} text-[10px] flex-shrink-0 mt-0.5`}>{domain?.icon}</span>
                    <p className="text-slate-300 text-sm flex-1 leading-snug">{q.text}</p>
                    <ChevronRight size={15} className={`text-slate-600 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-2 animate-fade-up">
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correct
                        const isYours = oi === yourAnswer
                        if (!isCorrect && !isYours) return null
                        return (
                          <div key={oi} className={`flex items-start gap-2 p-2.5 rounded-xl text-xs ${isCorrect ? 'bg-emerald-500/[0.08] text-emerald-300' : 'bg-red-500/[0.08] text-red-300'}`}>
                            <span className="font-bold flex-shrink-0">{isCorrect ? '✓ Correcta:' : '✗ Tu respuesta:'}</span>
                            <span>{opt}</span>
                          </div>
                        )
                      })}
                      <div className="p-3 bg-white/[0.03] rounded-xl">
                        <p className="text-slate-500 text-xs leading-relaxed">{q.explanation}</p>
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
          <div className="flex items-center justify-between mb-6 animate-fade-up">
            <h1 className="text-2xl font-black tracking-tight">
              <span className="gradient-text">Simulador</span>
            </h1>
            <button onClick={reset} className="btn-ghost text-xs">
              <ArrowLeft size={14} /> Configuración
            </button>
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
          <h1 className="text-2xl font-black tracking-tight mb-6">
            <span className="gradient-text">Resultados</span>
          </h1>
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
