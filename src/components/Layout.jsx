import { useState } from 'react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'flashcards', label: 'Flashcards', icon: CardIcon },
  { id: 'quiz', label: 'Quiz', icon: QuizIcon },
  { id: 'domains', label: 'Study Guide', icon: BookIcon },
]

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
}

function QuizIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Layout({ currentPage, onNavigate, stats, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNav(id) {
    onNavigate(id)
    setMobileOpen(false)
  }

  const Sidebar = ({ mobile }) => (
    <nav
      className={mobile
        ? 'flex flex-col h-full'
        : 'hidden lg:flex flex-col h-full'
      }
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-aws-navy-lighter">
        <div className="w-9 h-9 rounded-lg bg-aws-orange flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">AWS AI</p>
          <p className="text-aws-orange text-xs font-medium">Practitioner</p>
        </div>
      </div>

      {/* Nav links */}
      <ul className="flex-1 px-3 py-4 space-y-1" role="list">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = currentPage === item.id
          return (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-aws-orange text-white'
                    : 'text-gray-300 hover:bg-aws-navy-lighter hover:text-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Stats footer */}
      <div className="px-4 py-4 border-t border-aws-navy-lighter">
        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-3">Progress</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Overall mastery</span>
              <span className="text-aws-orange font-semibold">{stats.overallScore}%</span>
            </div>
            <div className="h-1.5 bg-aws-navy-lighter rounded-full overflow-hidden">
              <div
                className="h-full bg-aws-orange rounded-full transition-all duration-700"
                style={{ width: `${stats.overallScore}%` }}
                role="progressbar"
                aria-valuenow={stats.overallScore}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>🔥 {stats.streak} day streak</span>
            <span>{stats.learnedCards}/{stats.totalFlashcards} cards</span>
          </div>
        </div>
      </div>
    </nav>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-aws-navy flex-col flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-72 bg-aws-navy flex flex-col">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-300 hover:text-white rounded-lg"
                aria-label="Close navigation menu"
              >
                <CloseIcon />
              </button>
            </div>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-aws-navy border-b border-aws-navy-lighter flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-300 hover:text-white rounded-lg"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-aws-orange flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">AWS AI Practitioner</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
