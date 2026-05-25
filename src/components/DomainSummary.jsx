import { useState } from 'react'
import { ChevronLeft, ChevronDown, ChevronUp, Cloud, Target, Layers } from 'lucide-react'
import { DOMAIN_COLORS } from '../data/domains'

function ServiceBadge({ name, desc }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="text-left w-full group"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all border border-white/[0.04] hover:border-white/[0.08]">
        <span className="font-mono text-sm font-semibold text-amber-300">{name}</span>
        <div className="text-slate-600 group-hover:text-slate-400 transition-colors">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>
      {open && (
        <p className="px-3 py-2.5 text-xs text-slate-500 leading-relaxed border-l-2 border-amber-500/30 ml-3 mt-1.5 animate-fade-up">
          {desc}
        </p>
      )}
    </button>
  )
}

function DomainDetail({ domain, stats, onNavigate }) {
  const colors = DOMAIN_COLORS[domain.color]
  const domainStat = stats.domainStats[domain.id] || { total: 0, correct: 0, answered: 0 }
  const pct = domainStat.total > 0
    ? Math.round((domainStat.correct / domainStat.total) * 100)
    : 0

  return (
    <div className="animate-fade-up">
      {/* Domain header */}
      <div className={`rounded-2xl bg-gradient-to-br ${colors.solidGradient} p-6 text-white mb-5 shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-4xl mb-3 block" aria-hidden="true">{domain.icon}</span>
              <h2 className="text-xl font-black leading-tight mb-1.5">{domain.name}</h2>
              <p className="text-white/60 text-sm leading-relaxed">{domain.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-black leading-none">{domain.weight}%</p>
              <p className="text-white/40 text-xs mt-1 font-medium">del examen</p>
            </div>
          </div>

          <div className="mt-5 flex gap-2.5">
            <button
              onClick={() => onNavigate('quiz', domain.id)}
              className="flex-1 py-2 px-4 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 backdrop-blur-sm"
            >
              <Target size={14} /> Quiz
            </button>
            <button
              onClick={() => onNavigate('flashcards', domain.id)}
              className="flex-1 py-2 px-4 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 backdrop-blur-sm"
            >
              <Layers size={14} /> Flashcards
            </button>
          </div>
        </div>
      </div>

      {domainStat.answered > 0 && (
        <div className="card p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-400">Tu progreso</span>
            <span className={`text-sm font-bold ${colors.text}`}>{pct}%</span>
          </div>
          <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.solidGradient} rounded-full transition-all duration-700`}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">{domainStat.answered}/{domainStat.total} preguntas</p>
        </div>
      )}

      <section aria-labelledby={`concepts-${domain.id}`} className="mb-6">
        <h3 id={`concepts-${domain.id}`} className="section-title mb-4">Conceptos Clave</h3>
        <div className="space-y-3">
          {domain.keyConcepts.map((section, si) => (
            <div key={si} className="card p-5">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${colors.solidGradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`} aria-hidden="true">
                  {si + 1}
                </span>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.points.map((point, pi) => {
                  const colonIdx = point.indexOf(':')
                  const hasTerm = colonIdx > 0 && colonIdx < 60
                  const term = hasTerm ? point.slice(0, colonIdx) : null
                  const rest = hasTerm ? point.slice(colonIdx + 1) : point
                  return (
                    <li key={pi} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className={`mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${colors.solidGradient} flex-shrink-0`} aria-hidden="true" />
                      {hasTerm ? (
                        <span>
                          <strong className={`${colors.text} font-semibold`}>{term}:</strong>
                          <span>{rest}</span>
                        </span>
                      ) : (
                        <span>{point}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby={`services-${domain.id}`}>
        <h3 id={`services-${domain.id}`} className="section-title mb-4 flex items-center gap-2">
          <Cloud size={16} className="text-slate-500" />
          Servicios AWS del Dominio
        </h3>
        <div className="card p-4 space-y-2">
          {domain.awsServices.map((svc, i) => (
            <ServiceBadge key={i} name={svc.name} desc={svc.desc} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function DomainSummary({ domains, selectedDomain, stats, onNavigate }) {
  const [activeDomain, setActiveDomain] = useState(
    selectedDomain !== null ? selectedDomain : null
  )

  const domain = activeDomain !== null ? domains.find(d => d.id === activeDomain) : null

  if (!domain) {
    return (
      <div className="p-5 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
            <span className="gradient-text">Guía</span>
            <span className="text-white"> de Estudio</span>
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">Referencia completa para los {domains.length} dominios del examen AIF-C01</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
          {domains.map(d => {
            const colors = DOMAIN_COLORS[d.color]
            const domainStat = stats.domainStats[d.id] || { total: 0, correct: 0 }
            const pct = domainStat.total > 0
              ? Math.round((domainStat.correct / domainStat.total) * 100)
              : 0

            return (
              <button
                key={d.id}
                onClick={() => setActiveDomain(d.id)}
                className="card p-5 text-left group hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl" aria-hidden="true">{d.icon}</span>
                  <span className={`badge border ${colors.badge} text-[10px]`}>{d.weight}% examen</span>
                </div>
                <h2 className="font-bold text-white leading-tight mb-1 text-sm">{d.name}</h2>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">{d.description}</p>

                <div className="space-y-1.5">
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.solidGradient} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${d.name}: ${pct}% dominado`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{pct}% dominado</span>
                    <span className={`font-medium ${colors.text}`}>{d.keyConcepts.length} secciones · {d.awsServices.length} servicios</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <button
        onClick={() => setActiveDomain(null)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white mb-5 transition-colors font-medium"
        aria-label="Volver a todos los dominios"
      >
        <ChevronLeft size={16} />
        Todos los Dominios
      </button>

      <div className="flex gap-1.5 flex-wrap mb-5" role="tablist" aria-label="Seleccionar dominio">
        {domains.map(d => {
          const colors = DOMAIN_COLORS[d.color]
          const active = d.id === activeDomain
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveDomain(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                active ? `${colors.bg} text-white border border-transparent` : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {d.icon} {d.shortName}
            </button>
          )
        })}
      </div>

      <DomainDetail domain={domain} stats={stats} onNavigate={onNavigate} />
    </div>
  )
}
