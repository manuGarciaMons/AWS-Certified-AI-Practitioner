import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Check, RefreshCw, Keyboard } from 'lucide-react'
import { DOMAIN_COLORS } from '../data/domains'

export default function Flashcards({ flashcards, domains, selectedDomain, progress, onMark, onNavigate }) {
  const [activeDomain, setActiveDomain] = useState(selectedDomain ?? 'all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [filter, setFilter] = useState('all')
  const [showHint, setShowHint] = useState(false)

  const filtered = flashcards.filter(card => {
    const domainMatch = activeDomain === 'all' || card.domainId === activeDomain
    const status = progress.flashcards[card.id]
    const statusMatch =
      filter === 'all' ||
      (filter === 'learned' && status === 'learned') ||
      (filter === 'review' && status === 'review') ||
      (filter === 'new' && !status)
    return domainMatch && statusMatch
  })

  const card = filtered[currentIndex]
  const learnedInSet = filtered.filter(c => progress.flashcards[c.id] === 'learned').length

  function advance(delta) {
    setFlipped(false)
    setTimeout(() => setCurrentIndex(i => Math.max(0, Math.min(filtered.length - 1, i + delta))), 150)
  }

  function handleMark(status) {
    if (card) {
      onMark(card.id, status)
      if (currentIndex < filtered.length - 1) advance(1)
    }
  }

  const handleKey = useCallback((e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); advance(1); break
      case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); advance(-1); break
      case ' ': e.preventDefault(); setFlipped(f => !f); break
      case '1': if (flipped && card) handleMark('review'); break
      case '2': if (flipped && card) handleMark('learned'); break
    }
  }, [currentIndex, filtered.length, flipped, card]) // eslint-disable-line

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => { setCurrentIndex(0); setFlipped(false) }, [activeDomain, filter])
  useEffect(() => { if (selectedDomain !== null) setActiveDomain(selectedDomain) }, [selectedDomain])

  const pct = filtered.length > 0 ? Math.round(((currentIndex + 1) / filtered.length) * 100) : 0

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-3 animate-fade-up">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
            <span className="gradient-text">Flashcards</span>
          </h1>
          <p className="text-slate-600 mt-1.5 text-xs font-medium">
            <Keyboard size={11} className="inline mr-1 opacity-70" />
            Espacio = girar · ← → = navegar · 1 = repasar · 2 = aprendida
          </p>
        </div>
        <button
          onClick={() => setShowHint(h => !h)}
          className="btn-ghost text-xs flex-shrink-0 mt-1"
          aria-label="Mostrar atajos de teclado"
        >
          <Keyboard size={14} />
        </button>
      </div>

      {showHint && (
        <div className="card p-4 mb-4 text-xs text-slate-500 grid grid-cols-2 gap-2 animate-scale-in">
          {[['Espacio', 'Girar tarjeta'], ['← →', 'Navegar'], ['1', 'Marcar "Repasar"'], ['2', 'Marcar "Aprendida"']].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-slate-300 font-mono text-[10px] border border-white/[0.08]">{k}</kbd>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Domain filter */}
      <div className="flex gap-1.5 flex-wrap mb-3 animate-fade-up" style={{ animationDelay: '80ms' }} role="tablist" aria-label="Filtrar por dominio">
        <button role="tab" aria-selected={activeDomain === 'all'} onClick={() => setActiveDomain('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${activeDomain === 'all' ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.25)]' : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'}`}>
          Todos
        </button>
        {domains.map(d => {
          const colors = DOMAIN_COLORS[d.color]
          const active = activeDomain === d.id
          return (
            <button key={d.id} role="tab" aria-selected={active} onClick={() => setActiveDomain(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${active ? `${colors.bg} text-white` : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'}`}>
              {d.icon} {d.shortName}
            </button>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-5 animate-fade-up" style={{ animationDelay: '120ms' }} role="group" aria-label="Filtrar por estado">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'new', label: '⬜ Nuevas' },
          { id: 'review', label: '🔄 Repasar' },
          { id: 'learned', label: '✅ Aprendidas' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${filter === f.id ? 'bg-white/[0.08] text-white border border-white/[0.1]' : 'bg-white/[0.02] text-slate-500 hover:text-slate-300 border border-white/[0.04]'}`}>
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-600 flex items-center self-center font-medium">
          {learnedInSet}/{filtered.length} aprendidas
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <RotateCcw size={32} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No hay tarjetas con este filtro</p>
          <button onClick={() => setFilter('all')} className="btn-primary mt-4 mx-auto text-sm">
            Ver todas las tarjetas
          </button>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
              <span>Tarjeta {currentIndex + 1} de {filtered.length}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(139,92,246,0.3)]" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Flip card */}
          <div
            className="flip-card w-full cursor-pointer mb-5 select-none"
            style={{ height: '320px' }}
            onClick={() => setFlipped(f => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
            aria-label={flipped ? 'Respuesta (pulsa Enter para ver la pregunta)' : 'Pregunta (pulsa Enter para ver la respuesta)'}
          >
            <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
              {/* Front */}
              <div className="flip-card-front rounded-2xl p-6 flex flex-col justify-between bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.1] transition-all">
                <div className="flex items-start justify-between">
                  {card && (() => {
                    const d = domains.find(x => x.id === card.domainId)
                    const colors = d ? DOMAIN_COLORS[d.color] : DOMAIN_COLORS.blue
                    return <span className={`badge border ${colors.badge} text-[10px]`}>{d?.icon} {d?.shortName}</span>
                  })()}
                  <span className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Pregunta</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-4">
                  <p className="text-lg font-bold text-white text-center leading-relaxed">{card?.front}</p>
                </div>
                <p className="text-center text-slate-700 text-[10px] font-medium">Clic · Espacio · Enter para revelar</p>
              </div>

              {/* Back */}
              <div className="flip-card-back rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900/95 to-[#0a0d14] border border-white/[0.08]">
                <div className="flex items-start justify-between">
                  <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Respuesta</span>
                  {card && progress.flashcards[card.id] === 'learned' && (
                    <span className="badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px]">Aprendida</span>
                  )}
                </div>
                <div className="flex-1 flex items-start justify-start py-4 overflow-y-auto">
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{card?.back}</p>
                </div>
                <p className="text-center text-slate-700 text-[10px] font-medium">Clic · Espacio para volver</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button onClick={() => advance(-1)} disabled={currentIndex === 0}
              className="btn-secondary disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-1.5 px-3 py-2 text-sm">
              <ChevronLeft size={16} /> Anterior
            </button>

            {flipped && card && (
              <div className="flex-1 flex gap-2 justify-center">
                <button onClick={() => handleMark('review')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 font-semibold text-sm transition-all border border-violet-500/15 hover:border-violet-500/30 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                  aria-label="Marcar como necesita repaso (tecla 1)">
                  <RefreshCw size={14} /> Repasar
                </button>
                <button onClick={() => handleMark('learned')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-sm transition-all border border-emerald-500/15 hover:border-emerald-500/30 hover:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  aria-label="Marcar como aprendida (tecla 2)">
                  <Check size={14} /> ¡La sé!
                </button>
              </div>
            )}

            <button onClick={() => advance(1)} disabled={currentIndex === filtered.length - 1}
              className="btn-secondary disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-1.5 px-3 py-2 text-sm">
              Siguiente <ChevronRight size={16} />
            </button>
          </div>

          {currentIndex === filtered.length - 1 && learnedInSet === filtered.length && filtered.length > 0 && (
            <div className="mt-5 p-5 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl text-center animate-scale-in">
              <p className="text-2xl mb-1.5" aria-hidden="true">🎉</p>
              <p className="text-emerald-400 font-bold">¡Has aprendido todas las {filtered.length} tarjetas!</p>
              <button onClick={() => onNavigate('quiz', typeof activeDomain === 'number' ? activeDomain : null)}
                className="btn-primary mt-3 mx-auto text-sm">
                Ponlo a prueba en el simulador →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
