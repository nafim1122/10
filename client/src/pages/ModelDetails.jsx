import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../services/auth'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ModelDetails() {
  const { id } = useParams()
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadModel()
  }, [id])

  useEffect(() => {
    // subscribe to purchase events for realtime updates
    let es
    try{
      es = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/events`)
      es.addEventListener('purchase', (ev) => {
        try{
          const d = JSON.parse(ev.data)
          if (d && d.id === id) {
            setModel(prev => prev ? { ...prev, purchasesCount: d.purchasesCount, purchased: d.purchased } : prev)
          }
        }catch(e){ }
      })
    }catch(e){ }
    return () => { if (es) es.close() }
  }, [id])

  async function loadModel() {
    try {
      setLoading(true)
      const res = await api.getModel(id)
      setModel(res.data)
    } catch (err) {
      toast.show('Model not found')
      navigate('/models')
    } finally {
      setLoading(false)
    }
  }

  async function handlePurchase() {
    try {
      setPurchasing(true)
      const res = await api.purchaseModel(id)
      const newCount = res.data && (typeof res.data.purchasesCount === 'number' ? res.data.purchasesCount : undefined)
      if (typeof newCount === 'number') setModel(prev => prev ? { ...prev, purchasesCount: newCount } : prev)
      toast.show('Model purchased successfully')
    } catch (err) {
      toast.show('Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true)
      await api.deleteModel(id)
      toast.show('Model deleted')
      navigate('/models')
    } catch (err) {
      toast.show('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />
  if (!model) return <div className="center">Model not found</div>

  const isOwner = user && user.email === model.createdBy

  return (
    <div>
      <div className="card">
        <h2>{model.name}</h2>
        {model.image && <img className="card-img" src={model.image} alt={model.name} />}
        <p><strong>Framework:</strong> {model.framework}</p>
        <p><strong>Use Case:</strong> {model.useCase}</p>
        <p><strong>Dataset:</strong> {model.dataset}</p>
        <p><strong>Description:</strong> {model.description}</p>
        <p><strong>Created By:</strong> {model.createdBy}</p>
        <p><strong>Created At:</strong> {new Date(model.createdAt).toLocaleDateString()}</p>
        <p><strong>Views:</strong> {model.purchased || 0}</p>
        <p><strong>Purchases:</strong> {model.purchasesCount || 0}</p>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => navigate('/models')}>Back to Models</button>
          {isOwner && (
            <>
              <button className="btn" onClick={() => navigate(`/update-model/${id}`)}>Edit</button>
              <button className="btn danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
          {!isOwner && (
            <button className="btn primary" onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? 'Purchasing...' : 'Purchase Model'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}