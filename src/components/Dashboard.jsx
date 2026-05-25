import { useMemo } from 'react'
import { TrendingUp, Flame, Layers, Target, ArrowRight, Lightbulb, Zap, BookOpen, Award } from 'lucide-react'
import { DOMAIN_COLORS } from '../data/domains'
import { DAILY_TIPS } from '../data/mockData'

function ProgressRing({ score, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#8b5cf6' : '#6366f1'
  const glowColor = score >= 75 ? 'rgba(16,185,129,0.3)' : score >= 50 ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.3)'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black text-white leading-none">{score}</span>
        <span className="text-xs text-slate-500 font-semibold mt-0.5">puntos</span>
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
    { label: 'Preguntas', value: stats.totalAnswered, sub: `de 50`, Icon: Target, gradient: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400', valueColor: 'text-blue-400', border: 'border-blue-500/10' },
    { label: 'Cards', value: stats.learnedCards, sub: `de ${stats.totalFlashcards}`, Icon: Layers, gradient: 'from-violet-500/20 to-purple-500/10', iconColor: 'text-violet-400', valueColor: 'text-violet-400', border: 'border-violet-500/10' },
    { label: 'Racha', value: stats.streak, sub: 'días', Icon: Flame, gradient: 'from-orange-500/20 to-rose-500/10', iconColor: 'text-orange-400', valueColor: 'text-orange-400', border: 'border-orange-500/10' },
    { label: 'Sesiones', value: stats.quizHistory.length, sub: 'quizzes', Icon: TrendingUp, gradient: 'from-emerald-500/20 to-teal-500/10', iconColor: 'text-emerald-400', valueColor: 'text-emerald-400', border: 'border-emerald-500/10' },
  ]

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
          <span className="gradient-text">Dashboard</span>
          <span className="text-white"> de Estudio</span>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm font-medium">AWS Certified AI Practitioner — AIF-C01</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5 stagger-children">
        <div className="lg:col-span-2 card-glow p-6 flex items-center gap-6">
          <ProgressRing score={stats.overallScore} />
          <div className="flex-1 min-w-0">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">Preparación</p>
            <p className="text-white font-bold text-lg leading-tight">
              {stats.overallScore >= 75 ? '¡Listo para el examen!' : stats.overallScore >= 50 ? 'Buen progreso' : 'Empezando el camino'}
            </p>
            <p className="text-slate-600 text-xs mt-1 font-medium">{stats.totalCorrect}/{stats.totalAnswered} respuestas correctas</p>
            {weakDomain && (
              <button
                onClick={() => onNavigate('quiz', weakestDomain)}
                className="mt-4 flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors group"
              >
                <Zap size={12} className="group-hover:animate-pulse" />
                <span>Reforzar: {weakDomain.shortName}</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          {quickStats.map(({ label, value, sub, Icon, gradient, iconColor, valueColor, border }) => (
            <div key={label} className={`rounded-2xl bg-gradient-to-br ${gradient} border ${border} backdrop-blur-sm p-4 flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.02]`}>
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                <Icon size={18} className={iconColor} />
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-black ${valueColor} leading-none`}>{value}</p>
                <p className="text-white/80 text-xs font-semibold mt-0.5">{label}</p>
                <p className="text-white/30 text-[10px] font-medium">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consejo del día */}
      <div className="mb-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/15">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] via-blue-500/[0.04] to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-violet-500/[0.06] to-transparent pointer-events-none" />
          <div className="relative p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-violet-500/20">
              <Lightbulb size={18} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="gradient-text text-xs font-black uppercase tracking-widest">Consejo del Día</span>
                <span className="text-slate-700 text-xs">·</span>
                <span className="text-slate-500 text-xs font-medium">{todaysTip.category}</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-2 leading-snug">{todaysTip.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{todaysTip.content}</p>
              {todaysTip.examHint && (
                <div className="mt-3 px-3 py-2 bg-violet-500/[0.06] border border-violet-500/15 rounded-xl">
                  <p className="text-violet-300/80 text-xs leading-relaxed flex items-start gap-1.5">
                    <Award size={12} className="flex-shrink-0 mt-0.5" />
                    {todaysTip.examHint}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progreso por Dominio */}
      <section aria-labelledby="domains-title" className="mb-5 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 id="domains-title" className="section-title flex items-center gap-2">
            <BookOpen size={18} className="text-slate-500" />
            Progreso por Dominio
          </h2>
          <span className="text-slate-600 text-xs font-medium">{domains.length} dominios</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
          {domains.map(domain => {
            const ds = stats.domainStats[domain.id] || { total: 0, correct: 0, answered: 0 }
            const pct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0
            const answeredPct = ds.total > 0 ? Math.round((ds.answered / ds.total) * 100) : 0
            const colors = DOMAIN_COLORS[domain.color]

            return (
              <div key={domain.id} className="card p-4 group hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden="true">{domain.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight">{domain.shortName}</h3>
                      <span className={`badge ${colors.badge} text-[10px] mt-0.5`}>{domain.weight}% examen</span>
                    </div>
                  </div>
                  <span className={`text-xl font-black ${colors.text}`}>{pct}%</span>
                </div>

                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-1.5">
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
                <p className="text-slate-600 text-xs mb-3 font-medium">{ds.answered}/{ds.total} preguntas ({answeredPct}%)</p>

                <div className="flex gap-1.5">
                  {[
                    { label: 'Quiz', page: 'quiz' },
                    { label: 'Cards', page: 'flashcards' },
                    { label: 'Guía', page: 'domains' },
                  ].map(({ label, page }) => (
                    <button
                      key={page}
                      onClick={() => onNavigate(page, domain.id)}
                      className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-500 hover:text-white border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
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

      {stats.quizHistory.length > 0 && (
        <section aria-labelledby="history-title" className="animate-fade-up" style={{ animationDelay: '400ms' }}>
          <h2 id="history-title" className="section-title mb-4">Historial de Quizzes</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Fecha</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Dominio</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Resultado</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.quizHistory.slice(0, 6).map((entry, i) => {
                    const pct = Math.round((entry.score / entry.total) * 100)
                    const d = entry.domainId ? domains.find(x => x.id === entry.domainId) : null
                    return (
                      <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-slate-500 text-xs">{new Date(entry.date).toLocaleDateString('es-ES')}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{d ? d.shortName : 'Simulación completa'}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{entry.score}/{entry.total}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`badge ${pct >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : pct >= 50 ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'} border`}>
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
