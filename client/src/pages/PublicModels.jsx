import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import Loader from '../components/Loader'

export default function PublicModels(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [frameworks, setFrameworks] = useState([])
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try{
        const [modelsRes, fwRes] = await Promise.all([api.listPublicModels(), api.listPublicFrameworks()])
        const data = modelsRes.data || []
        setItems(data)
        setFrameworks((fwRes.data || []).sort())
      }catch(e){}
      finally{setLoading(false)}
    }
    load()

    // connect to SSE for realtime purchase updates
    let es
    try{
      es = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/events`)
      es.addEventListener('purchase', (ev) => {
        try{
          const d = JSON.parse(ev.data)
          // update items if present
          setItems(prev => prev.map(it => it._id === d.id ? { ...it, purchasesCount: d.purchasesCount, purchased: d.purchased } : it))
          // dispatch a global event so other components (e.g., cards) can update
          try{ window.dispatchEvent(new CustomEvent('modelPurchase', { detail: d })) }catch(e){}
        }catch(e){ }
      })
    }catch(e){ }
    return () => { if (es) es.close() }
  }, [])

  if (loading) return <Loader />

  // server-side search/filter: request again with params when query/filter applied
  const filtered = filter === 'All' && !query ? items : items.filter(it => (filter === 'All' || it.framework === filter) && (!query || (it.name || '').toLowerCase().includes(query.toLowerCase())))

  return (
    <div>
      <div className="list-header">
        <h2>All Models</h2>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="Search by name" value={query} onChange={e=>setQuery(e.target.value)} style={{padding:8,borderRadius:6,border:'1px solid #ddd'}} />
          <label htmlFor="framework" className="muted" style={{marginLeft:6,marginRight:8}}>Framework</label>
          <select id="framework" value={filter} onChange={async e => {
            const val = e.target.value
            setFilter(val)
            setLoading(true)
            try{
              const res = await api.listPublicModels({ framework: val === 'All' ? undefined : val, q: query || undefined })
              setItems(res.data || [])
            }catch(e){}
            finally{setLoading(false)}
          }}>
            <option value="All">All</option>
            {frameworks.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button className="btn small" onClick={async () => {
            // perform server-side search
            setLoading(true)
            try{
              const res = await api.listPublicModels({ framework: filter === 'All' ? undefined : filter, q: query || undefined })
              setItems(res.data || [])
            }catch(e){}
            finally{setLoading(false)}
          }}>Search</button>
        </div>
      </div>
      <div className="grid">
        {filtered.map(it => (
          <div className="card" key={it._id}>
            {it.image && <img className="card-img" src={it.image} alt={it.name} />}
            <h3 className="card-title">{it.name || it.modelName}</h3>
            <p><strong>Framework:</strong> {it.framework}</p>
            <p><strong>Use case:</strong> {it.useCase}</p>
            <div style={{ marginTop: 8 }}>
              <Link to={`/models/${it._id}`} className="btn small">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
