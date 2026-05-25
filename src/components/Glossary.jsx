import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, Zap, X } from 'lucide-react'
import { GLOSSARY_ITEMS, GLOSSARY_CATEGORIES } from '../data/mockData'

const CATEGORY_COLORS = {
  'IA Generativa': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Machine Learning': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Visión Artificial': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Procesamiento del Lenguaje': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Predicción': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Seguridad y Gobernanza': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
}

function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-amber-500/30 text-amber-200 rounded-sm not-italic">{part}</mark>
          : part
      )}
    </>
  )
}

function ServiceCard({ item, query }) {
  const [expanded, setExpanded] = useState(false)
  const catColor = CATEGORY_COLORS[item.category] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'

  return (
    <article className="card hover:border-slate-600/60 transition-all duration-200 hover:shadow-xl hover:shadow-black/20 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-4"
        aria-expanded={expanded}
        aria-controls={`service-${item.id}`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <span className={`badge border ${catColor} text-xs mb-2`}>{item.category}</span>
            <h3 className="text-white font-bold text-sm leading-tight">
              <Highlight text={item.name} query={query} />
            </h3>
          </div>
          <div className="flex-shrink-0 text-slate-500 mt-1">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
          <Highlight text={item.shortDesc} query={query} />
        </p>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div id={`service-${item.id}`} className="px-4 pb-4 border-t border-slate-700/40 pt-3 animate-fade-up">
          <p className="text-slate-300 text-xs leading-relaxed mb-3">{item.description}</p>

          {item.keyPoints?.length > 0 && (
            <div className="mb-3">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Características clave</p>
              <ul className="space-y-1">
                {item.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.examTip && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/8 border border-amber-500/20 rounded-xl">
              <Zap size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300 text-xs leading-relaxed">{item.examTip}</p>
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
    <div className="p-5 lg:p-8 max-w-5xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-7">
        <h1 className="page-title">Glosario de Servicios AWS</h1>
        <p className="text-slate-400 mt-1 text-sm">{GLOSSARY_ITEMS.length} servicios de IA/ML · haz clic en una tarjeta para expandirla</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar servicio, característica o caso de uso..."
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
          aria-label="Buscar en el glosario"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label="Filtrar por categoría">
        {GLOSSARY_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/60'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
            <span className={`ml-1.5 ${activeCategory === cat ? 'text-slate-700' : 'text-slate-600'}`}>
              ({counts[cat] || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || activeCategory !== 'Todos') && (
        <p className="text-slate-500 text-xs mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          {search && <> para "<span className="text-slate-300">{search}</span>"</>}
          {activeCategory !== 'Todos' && <> en <span className="text-slate-300">{activeCategory}</span></>}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-3xl mb-3" aria-hidden="true">🔍</p>
          <p className="text-slate-400 font-medium">No se encontraron servicios</p>
          <button onClick={() => { setSearch(''); setActiveCategory('Todos') }} className="btn-primary mt-4 mx-auto text-sm">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(item => (
            <ServiceCard key={item.id} item={item} query={search} />
          ))}
        </div>
      )}
    </div>
  )
}
