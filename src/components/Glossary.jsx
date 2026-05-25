import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, Zap, X } from 'lucide-react'
import { GLOSSARY_ITEMS, GLOSSARY_CATEGORIES } from '../data/mockData'

const CATEGORY_COLORS = {
  'IA Generativa': 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  'Machine Learning': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Visión Artificial': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'Procesamiento del Lenguaje': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'Predicción': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'Seguridad y Gobernanza': 'bg-rose-500/15 text-rose-400 border-rose-500/20',
}

function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-violet-500/25 text-violet-200 rounded-sm px-0.5 not-italic">{part}</mark>
          : part
      )}
    </>
  )
}

function ServiceCard({ item, query }) {
  const [expanded, setExpanded] = useState(false)
  const catColor = CATEGORY_COLORS[item.category] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'

  return (
    <article className="card overflow-hidden group">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-4"
        aria-expanded={expanded}
        aria-controls={`service-${item.id}`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <span className={`badge border ${catColor} text-[10px] mb-2`}>{item.category}</span>
            <h3 className="text-white font-bold text-sm leading-tight">
              <Highlight text={item.name} query={query} />
            </h3>
          </div>
          <div className="flex-shrink-0 text-slate-600 mt-1 group-hover:text-slate-400 transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
          <Highlight text={item.shortDesc} query={query} />
        </p>
      </button>

      {expanded && (
        <div id={`service-${item.id}`} className="px-4 pb-4 border-t border-white/[0.04] pt-3 animate-fade-up">
          <p className="text-slate-400 text-xs leading-relaxed mb-3">{item.description}</p>

          {item.keyPoints?.length > 0 && (
            <div className="mb-3">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Características clave</p>
              <ul className="space-y-1.5">
                {item.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.examTip && (
            <div className="flex items-start gap-2 p-3 bg-violet-500/[0.06] border border-violet-500/15 rounded-xl">
              <Zap size={13} className="text-violet-400 flex-shrink-0 mt-0.5" />
              <p className="text-violet-300/80 text-xs leading-relaxed">{item.examTip}</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return GLOSSARY_ITEMS.filter(item => {
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keyPoints?.some(p => p.toLowerCase().includes(q))
      const matchCat = activeCategory === 'Todos' || item.category === activeCategory
      return matchSearch && matchCat
    })
  }, [search, activeCategory])

  const counts = useMemo(() => {
    const c = { Todos: GLOSSARY_ITEMS.length }
    GLOSSARY_ITEMS.forEach(item => {
      c[item.category] = (c[item.category] || 0) + 1
    })
    return c
  }, [])

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
          <span className="gradient-text">Glosario</span>
          <span className="text-white"> de Servicios AWS</span>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm font-medium">{GLOSSARY_ITEMS.length} servicios de IA/ML · haz clic en una tarjeta para expandirla</p>
      </div>

      {/* Search */}
      <div className="relative mb-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar servicio, característica o caso de uso..."
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all"
          aria-label="Buscar en el glosario"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6 animate-fade-up" style={{ animationDelay: '120ms' }} role="group" aria-label="Filtrar por categoría">
        {GLOSSARY_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
            <span className={`ml-1.5 ${activeCategory === cat ? 'text-slate-800' : 'text-slate-600'}`}>
              ({counts[cat] || 0})
            </span>
          </button>
        ))}
      </div>

      {(search || activeCategory !== 'Todos') && (
        <p className="text-slate-600 text-xs mb-4 font-medium">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          {search && <> para &ldquo;<span className="text-slate-400">{search}</span>&rdquo;</>}
          {activeCategory !== 'Todos' && <> en <span className="text-slate-400">{activeCategory}</span></>}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-3xl mb-3" aria-hidden="true">🔍</p>
          <p className="text-slate-400 font-medium">No se encontraron servicios</p>
          <button onClick={() => { setSearch(''); setActiveCategory('Todos') }} className="btn-primary mt-4 mx-auto text-sm">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
          {filtered.map(item => (
            <ServiceCard key={item.id} item={item} query={search} />
          ))}
        </div>
      )}
    </div>
  )
}
