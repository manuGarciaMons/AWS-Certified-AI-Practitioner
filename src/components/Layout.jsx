import { useState } from 'react'
import { Home, Layers, Target, BookOpen, BookMarked, X, Menu, Flame, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', Icon: Home },
  { id: 'flashcards', label: 'Flashcards', Icon: Layers },
  { id: 'quiz', label: 'Simulador', Icon: Target },
  { id: 'glossary', label: 'Glosario', Icon: BookOpen },
  { id: 'domains', label: 'Guía de Estudio', Icon: BookMarked },
]

export default function Layout({ currentPage, onNavigate, stats, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNav(id) {
    onNavigate(id)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none">AWS AI</p>
            <p className="text-amber-400 text-xs font-semibold mt-0.5">Practitioner</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = currentPage === id
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-amber-400' : ''}`} size={18} />
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight size={14} className="text-amber-400/60" />}
            </button>
          )
        })}
      </nav>

      {/* Progress footer */}
      <div className="px-4 pb-5 pt-3 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-slate-400">Progreso general</span>
          <span className="font-bold text-amber-400">{stats.overallScore}%</span>
        </div>
        <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${stats.overallScore}%` }}
            role="progressbar"
            aria-valuenow={stats.overallScore}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Flame size={13} className="text-amber-400" />
            <span className="text-slate-300 font-semibold">{stats.streak}</span> día{stats.streak !== 1 ? 's' : ''}
          </span>
          <span>{stats.learnedCards}/{stats.totalFlashcards} cards</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-slate-900/95 border-r border-slate-800 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg" aria-label="Cerrar menú">
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-400 hover:text-white rounded-lg" aria-label="Abrir menú" aria-expanded={mobileOpen}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">AWS AI Practitioner</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
