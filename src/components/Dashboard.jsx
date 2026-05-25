import { useMemo } from 'react'
import { TrendingUp, Flame, Layers, Target, BookOpen, ArrowRight, Lightbulb, ChevronRight } from 'lucide-react'
import { DOMAIN_COLORS } from '../data/domains'
import { DAILY_TIPS } from '../data/mockData'

function ProgressRing({ score, size = 88, stroke = 8 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(51,65,85,0.6)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-black text-white leading-none">{score}<span className="text-base text-slate-400">%</span></span>
      </div>
    </div>
  )
}

export default function Dashboard({ stats, domains, onNavigate, weakestDomain }) {
  const weakDomain = domains.find(d => d.id === weakestDomain)

  const todaysTip = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000)
    return DAILY_TIPS[day % DAILY_TIPS.length]
  }, [])

  const quickStats = [
    { label: 'Preguntas respondidas', value: stats.totalAnswered, sub: `de 50 total`, Icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Cards aprendidas', value: stats.learnedCards, sub: `de ${stats.totalFlashcards} total`, Icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Racha de días', value: stats.streak, sub: '¡sigue así!', Icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Sesiones de quiz', value: stats.quizHistory.length, sub: 'completadas', Icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-7">
        <h1 className="page-title">
          Dashboard de Estudio
        </h1>
        <p className="text-slate-400 mt-1 text-sm">AWS Certified AI Practitioner — AIF-C01</p>
      </div>

      {/* Hero: progress + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
        {/* Overall progress */}
        <div className="lg:col-span-2 card p-5 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center gap-5">
          <ProgressRing score={stats.overallScore} />
          <div className="flex-1 min-w-0">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Preparación general</p>
            <p className="text-white font-bold text-base leading-tight">
              {stats.overallScore >= 75 ? '¡Listo para el examen!' : stats.overallScore >= 50 ? 'Buen progreso' : 'Empezando el camino'}
            </p>
            <p className="text-slate-500 text-xs mt-1">{stats.totalCorrect}/{stats.totalAnswered} correctas</p>
            {weakDomain && (
              <button
                onClick={() => onNavigate('quiz', weakestDomain)}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>📌 Practicar: {weakDomain.shortName}</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          {quickStats.map(({ label, value, sub, Icon, color, bg }) => (
            <div key={label} className="card p-4 flex items-start gap-3">
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={color} />
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-black ${color} leading-none`}>{value}</p>
                <p className="text-white text-xs font-semibold mt-0.5 truncate">{label}</p>
                <p className="text-slate-500 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip del día */}
      <div className="mb-5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb size={18} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Consejo del Día</span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-slate-500 text-xs">{todaysTip.category}</span>
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">{todaysTip.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{todaysTip.content}</p>
            {todaysTip.examHint && (
              <div className="mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-300 text-xs leading-relaxed">{todaysTip.examHint}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Domain progress */}
      <section aria-labelledby="domains-title" className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 id="domains-title" className="section-title">Progreso por Dominio</h2>
          <span className="text-slate-500 text-xs">{domains.length} dominios</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {domains.map(domain => {
            const ds = stats.domainStats[domain.id] || { total: 0, correct: 0, answered: 0 }
            const pct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0
            const answeredPct = ds.total > 0 ? Math.round((ds.answered / ds.total) * 100) : 0
            const colors = DOMAIN_COLORS[domain.color]

            return (
              <div key={domain.id} className="card p-4 hover:border-slate-600/50 transition-all duration-200 hover:shadow-xl hover:shadow-black/20 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">{domain.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight">{domain.shortName}</h3>
                      <span className={`badge ${colors.badge} text-xs mt-0.5`}>{domain.weight}% examen</span>
                    </div>
                  </div>
                  <span className={`text-xl font-black ${colors.text}`}>{pct}%</span>
                </div>

                <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.solidGradient} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${domain.name}: ${pct}% correcto`}
                  />
                </div>
                <p className="text-slate-500 text-xs mb-3">{ds.answered}/{ds.total} preguntas ({answeredPct}%)</p>

                <div className="flex gap-1.5">
                  {[
                    { label: 'Quiz', page: 'quiz' },
                    { label: 'Cards', page: 'flashcards' },
                    { label: 'Guía', page: 'domains' },
                  ].map(({ label, page }) => (
                    <button
                      key={page}
                      onClick={() => onNavigate(page, domain.id)}
                      className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-150"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent quiz history */}
      {stats.quizHistory.length > 0 && (
        <section aria-labelledby="history-title">
          <h2 id="history-title" className="section-title mb-4">Historial de Quizzes</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60">
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">Fecha</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">Dominio</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">Resultado</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.quizHistory.slice(0, 6).map((entry, i) => {
                    const pct = Math.round((entry.score / entry.total) * 100)
                    const d = entry.domainId ? domains.find(x => x.id === entry.domainId) : null
                    return (
                      <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-slate-500 text-xs">{new Date(entry.date).toLocaleDateString('es-ES')}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{d ? d.shortName : 'Simulación completa'}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{entry.score}/{entry.total}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`badge ${pct >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : pct >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'} border`}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
