import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import Loader from '../components/Loader'

export default function MyPurchases(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getMyPurchases().then(res => {
      setItems(res.data || [])
    }).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <div className="list-header"><h2>My Purchases</h2></div>
      {items.length === 0 && <div className="card">You have not purchased any models yet.</div>}
      <div className="grid">
        {items.map(p => (
          <div className="card" key={p._id}>
            {p.model && p.model.image && <img className="card-img" src={p.model.image} alt={p.model.name} />}
              <h3 className="card-title">{p.model ? (p.model.name || p.model.modelName) : 'Model'}</h3>
            {p.model && <p className="muted">Purchased on: {new Date(p.createdAt).toLocaleString()}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
