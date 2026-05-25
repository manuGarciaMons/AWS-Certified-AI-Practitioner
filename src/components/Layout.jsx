import { useState } from 'react'
import { Home, Layers, Target, BookOpen, BookMarked, X, Menu, Flame, Sparkles } from 'lucide-react'

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
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 blur-lg opacity-25 animate-pulse-soft" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-extrabold text-sm leading-none tracking-tight">AWS AI</p>
            <p className="gradient-text text-xs font-bold mt-0.5">Practitioner</p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = currentPage === id
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/[0.12] to-blue-500/[0.06] border border-violet-500/20" />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-violet-400 to-blue-500" />
              )}
              <Icon className={`relative z-10 flex-shrink-0 transition-all duration-200 group-hover:scale-110 ${active ? 'text-violet-400' : ''}`} size={18} />
              <span className="relative z-10 flex-1 text-left">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Progress footer */}
      <div className="px-4 pb-5 pt-4">
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="font-semibold text-slate-400">Progreso</span>
            <span className="font-black gradient-text text-sm">{stats.overallScore}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
              style={{ width: `${stats.overallScore}%` }}
              role="progressbar"
              aria-valuenow={stats.overallScore}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Flame size={12} className="text-orange-400" />
              <span className="text-slate-300 font-semibold">{stats.streak}</span> día{stats.streak !== 1 ? 's' : ''}
            </span>
            <span>{stats.learnedCards}/{stats.totalFlashcards} cards</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#06080f]">
      <aside className="hidden lg:flex w-[260px] bg-[#0a0d14]/90 backdrop-blur-2xl border-r border-white/[0.04] flex-col flex-shrink-0 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/[0.04] to-transparent pointer-events-none" />
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-72 bg-[#0a0d14] border-r border-white/[0.06] flex flex-col">
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]" aria-label="Cerrar menú">
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0a0d14]/90 backdrop-blur-xl border-b border-white/[0.04] flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-400 hover:text-white rounded-lg" aria-label="Abrir menú" aria-expanded={mobileOpen}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">AWS AI Practitioner</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto ambient-bg dot-grid" id="main-content">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
