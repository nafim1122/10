import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import ModelCard from './ModelCard'
import { useToast } from './Toast'
import Loader from './Loader'

export default function ModelList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  async function load() {
    try {
      setLoading(true)
      const res = await api.listModels()
      setItems(res.data)
    } catch (err) {
      toast.show('Failed to load models')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <Loader />

  return (
    <div>
      <div className="list-header">
        <h2>Your models</h2>
        <Link to="/add" className="btn">Add Model</Link>
      </div>
      {items.length === 0 ? (
        <div className="card">No models found. Add your first model.</div>
      ) : (
        <div className="grid">
          {items.map(it => <ModelCard key={it._id} item={it} onDeleted={load} />)}
        </div>
      )}
    </div>
  )
}
