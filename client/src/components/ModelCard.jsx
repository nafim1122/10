import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../services/auth'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'

export default function ModelCard({ item, onDeleted }) {
  const toast = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { user } = useAuth()
  const [purchasedCount, setPurchasedCount] = useState(item.purchasesCount || 0)
  const [avgRating, setAvgRating] = useState(item.averageRating || 0)
  const [submittingRating, setSubmittingRating] = useState(false)
  React.useEffect(() => {
    const onModelPurchase = (ev) => {
      const d = ev.detail
      if (d && d.id === item._id && typeof d.purchasesCount === 'number') setPurchasedCount(d.purchasesCount)
    }
    window.addEventListener('modelPurchase', onModelPurchase)
    return () => window.removeEventListener('modelPurchase', onModelPurchase)
  }, [item._id])

  async function doDelete() {
    try {
      await api.deleteModel(item._id)
      toast.show('Model deleted')
      setConfirmOpen(false)
      if (onDeleted) onDeleted()
    } catch (err) {
      toast.show('Failed to delete')
    }
  }

  async function doPurchase() {
    if (!user) return toast.show('Please login to purchase')
    try {
      const res = await api.purchaseModel(item._id)
      const newCount = res.data && (typeof res.data.purchasesCount === 'number' ? res.data.purchasesCount : undefined)
      if (typeof newCount === 'number') setPurchasedCount(newCount)
      toast.show('Purchase recorded')
    } catch (err) {
      toast.show('Failed to purchase')
    }
  }

  async function submitRating(rating) {
    try {
      setSubmittingRating(true)
      const res = await api.rateModel(item._id, rating)
      if (res.data && typeof res.data.averageRating === 'number') setAvgRating(res.data.averageRating)
    } catch (err) {
      // no-op toast for simplicity
    } finally {
      setSubmittingRating(false)
    }
  }

  return (
    <div className="card">
      {item.image && <img className="card-img" src={item.image} alt={item.name || 'model'} />}
      <h3 className="card-title">{item.name || item.modelName}</h3>
      {item.description && <p className="muted">{item.description}</p>}
      <p><strong>Framework:</strong> {item.framework}</p>
      <p><strong>Use case:</strong> {item.useCase}</p>
      <p><strong>Dataset:</strong> {item.dataset}</p>
      <p><strong>Created by:</strong> {item.createdBy}</p>
      <div className="card-actions">
        <Link to={`/models/${item._id}`} className="btn small">View Details</Link>
        <Link to={`/update-model/${item._id}`} className="btn small">Edit</Link>
        <button className="btn small danger" onClick={() => setConfirmOpen(true)}>Delete</button>
        {user && user.email !== item.createdBy && <button className="btn small primary" onClick={doPurchase}>Purchase</button>}
      </div>
      <div style={{marginTop:8}}>
        <small>Purchases: {purchasedCount}</small>
        <div style={{marginTop:6}}>
          <small className="muted">Rating: </small>
          {[1,2,3,4,5].map(i => (
            <button key={i} className="btn small" style={{marginLeft:6,opacity: i <= Math.round(avgRating) ? 1 : 0.5}} disabled={submittingRating} onClick={() => submitRating(i)}>
              {i <= Math.round(avgRating) ? '★' : '☆'}
            </button>
          ))}
          <span style={{marginLeft:8}} className="muted">{avgRating ? avgRating.toFixed(1) : '—'}</span>
        </div>
      </div>
      <ConfirmDialog open={confirmOpen} title={`Delete ${item.name || item.modelName}?`} onConfirm={doDelete} onCancel={() => setConfirmOpen(false)} />
    </div>
  )
}
