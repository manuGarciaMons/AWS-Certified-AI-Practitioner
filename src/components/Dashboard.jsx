import { DOMAIN_COLORS } from '../data/domains'

const DOMAIN_COLOR_MAP = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
}

export default function Dashboard({ stats, domains, onNavigate, weakestDomain }) {
  const weakDomain = domains.find(d => d.id === weakestDomain)

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Study Dashboard
        </h1>
        <p className="text-gray-500 mt-1">AWS Certified AI Practitioner (AIF-C01)</p>
      </div>

      {/* Hero progress card */}
      <div className="card p-6 mb-6 bg-gradient-to-br from-aws-navy to-aws-navy-light text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <p className="text-gray-300 text-sm font-medium">Overall Exam Readiness</p>
            <p className="text-4xl font-black mt-1">{stats.overallScore}<span className="text-2xl text-gray-300">%</span></p>
          </div>
          {weakDomain && (
            <button
              onClick={() => onNavigate('quiz', weakestDomain)}
              className="flex-shrink-0 px-5 py-2.5 bg-aws-orange hover:bg-aws-orange-dark text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Continue Studying →
            </button>
          )}
        </div>

        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-aws-orange to-aws-orange-light rounded-full transition-all duration-1000"
            style={{ width: `${stats.overallScore}%` }}
            role="progressbar"
            aria-valuenow={stats.overallScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall exam readiness: ${stats.overallScore}%`}
          />
        </div>

        <div className="flex gap-6 mt-4 text-sm">
          <span className="text-gray-300">
            <span className="text-white font-semibold">{stats.totalCorrect}</span>/{stats.totalAnswered} questions correct
          </span>
          {weakDomain && (
            <span className="text-amber-300">
              📌 Focus on: <span className="font-semibold">{weakDomain.shortName}</span>
            </span>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Questions Answered', value: stats.totalAnswered, icon: '📝', sub: 'of 50 total', color: 'blue' },
          { label: 'Cards Learned', value: stats.learnedCards, icon: '🃏', sub: `of ${stats.totalFlashcards} total`, color: 'purple' },
          { label: 'Day Streak', value: stats.streak, icon: '🔥', sub: 'keep it going!', color: 'orange' },
          { label: 'Quiz Sessions', value: stats.quizHistory.length, icon: '🎯', sub: 'completed', color: 'green' },
        ].map(item => (
          <div key={item.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl" aria-hidden="true">{item.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">{item.label}</p>
            <p className="text-xs text-gray-400">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Domain progress */}
      <section aria-labelledby="domain-heading" className="mb-8">
        <h2 id="domain-heading" className="text-lg font-bold text-gray-900 mb-4">
          Progress by Domain
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {domains.map(domain => {
            const domainStat = stats.domainStats[domain.id] || { total: 0, correct: 0, answered: 0 }
            const pct = domainStat.total > 0
              ? Math.round((domainStat.correct / domainStat.total) * 100)
              : 0
            const answeredPct = domainStat.total > 0
              ? Math.round((domainStat.answered / domainStat.total) * 100)
              : 0
            const colors = DOMAIN_COLORS[domain.color]

            return (
              <div key={domain.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">{domain.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{domain.shortName}</h3>
                      <span className={`badge ${colors.badge} mt-1`}>{domain.weight}% of exam</span>
                    </div>
                  </div>
                  <span className={`text-xl font-black ${colors.text}`}>{pct}%</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${DOMAIN_COLOR_MAP[domain.color]} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${domain.name}: ${pct}% correct`}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{domainStat.answered}/{domainStat.total} questions attempted ({answeredPct}%)</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onNavigate('quiz', domain.id)}
                    className="flex-1 text-xs font-medium py-1.5 px-3 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    Practice Quiz
                  </button>
                  <button
                    onClick={() => onNavigate('flashcards', domain.id)}
                    className="flex-1 text-xs font-medium py-1.5 px-3 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => onNavigate('domains', domain.id)}
                    className="flex-1 text-xs font-medium py-1.5 px-3 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    Study Guide
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent quiz history */}
      {stats.quizHistory.length > 0 && (
        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-lg font-bold text-gray-900 mb-4">Recent Quiz Results</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Domain</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Score</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Result</th>
                </tr>
              </thead>
              <tbody>
                {stats.quizHistory.slice(0, 5).map((entry, i) => {
                  const pct = Math.round((entry.score / entry.total) * 100)
                  const domain = entry.domainId
                    ? domains.find(d => d.id === entry.domainId)
                    : null
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {domain ? domain.shortName : 'Full Exam'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {entry.score}/{entry.total}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`badge ${pct >= 75 ? 'bg-green-100 text-green-800' : pct >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
