import { useState } from 'react'
import { DOMAIN_COLORS } from '../data/domains'

const COLOR_GRADIENTS = {
  blue: 'from-blue-600 to-blue-700',
  purple: 'from-purple-600 to-purple-700',
  green: 'from-green-600 to-green-700',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-600 to-red-700',
}

function ServiceBadge({ name, desc }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="text-left w-full group"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-aws-navy/5 hover:bg-aws-navy/10 transition-colors">
        <span className="font-mono text-sm font-semibold text-aws-navy">{name}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <p className="px-3 py-2 text-xs text-gray-600 leading-relaxed border-l-2 border-aws-orange ml-2 mt-1">
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
    <div className="animate-fade-in">
      {/* Domain header */}
      <div className={`rounded-2xl bg-gradient-to-br ${COLOR_GRADIENTS[domain.color]} p-6 text-white mb-6`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-4xl" aria-hidden="true">{domain.icon}</span>
            <h2 className="text-2xl font-black mt-2 leading-tight">{domain.name}</h2>
            <p className="text-white/80 mt-1 text-sm">{domain.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-black">{domain.weight}%</p>
            <p className="text-white/70 text-xs">of exam</p>
          </div>
        </div>

        <div className="mt-5 flex gap-4">
          <button
            onClick={() => onNavigate('quiz', domain.id)}
            className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Practice Quiz
          </button>
          <button
            onClick={() => onNavigate('flashcards', domain.id)}
            className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Flashcards
          </button>
        </div>
      </div>

      {/* Progress for this domain */}
      {domainStat.answered > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Your progress</span>
            <span className={`font-bold ${colors.text}`}>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bg} rounded-full`}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{domainStat.answered}/{domainStat.total} questions attempted</p>
        </div>
      )}

      {/* Key concepts */}
      <section aria-labelledby={`concepts-${domain.id}`} className="mb-8">
        <h3 id={`concepts-${domain.id}`} className="text-lg font-bold text-gray-900 mb-4">
          Key Concepts
        </h3>
        <div className="space-y-4">
          {domain.keyConcepts.map((section, si) => (
            <div key={si} className="card p-5">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`} aria-hidden="true">
                  {si + 1}
                </span>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.points.map((point, pi) => {
                  const [term, ...rest] = point.split(':')
                  const hasTerm = rest.length > 0 && term.length < 60
                  return (
                    <li key={pi} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.bg} flex-shrink-0`} aria-hidden="true" />
                      {hasTerm ? (
                        <span>
                          <strong className="text-gray-900">{term}:</strong>
                          {rest.join(':')}
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

      {/* AWS Services */}
      <section aria-labelledby={`services-${domain.id}`}>
        <h3 id={`services-${domain.id}`} className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">☁️</span>
          AWS Services to Know
        </h3>
        <div className="card p-5 space-y-2">
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
      <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Study Guide</h1>
          <p className="text-gray-500 mt-1">Complete reference for all 5 exam domains</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                className="card p-6 text-left hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl" aria-hidden="true">{d.icon}</span>
                  <span className={`badge ${colors.badge}`}>{d.weight}%</span>
                </div>
                <h2 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-aws-navy">{d.name}</h2>
                <p className="text-xs text-gray-500 mb-4">{d.description}</p>

                <div className="space-y-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bg} rounded-full`}
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${d.name} progress: ${pct}%`}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{pct}% mastered</p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 group-hover:text-aws-orange transition-colors">
                  <span>{d.keyConcepts.length} concept sections</span>
                  <span>·</span>
                  <span>{d.awsServices.length} AWS services</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb / Back */}
      <button
        onClick={() => setActiveDomain(null)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        aria-label="Back to all domains"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Domains
      </button>

      {/* Domain tabs */}
      <div className="flex gap-2 flex-wrap mb-6" role="tablist" aria-label="Select domain">
        {domains.map(d => {
          const colors = DOMAIN_COLORS[d.color]
          const active = d.id === activeDomain
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveDomain(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                active ? `${colors.bg} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
