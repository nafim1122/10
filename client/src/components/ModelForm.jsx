import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useToast } from './Toast'
import Loader from './Loader'

export default function ModelForm({ editMode }) {
  const [name, setName] = useState('')
  const [framework, setFramework] = useState('')
  const [description, setDescription] = useState('')
  const [useCase, setUseCase] = useState('')
  const [dataset, setDataset] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (editMode && id) {
      setLoading(true)
      api.getModel(id).then(res => {
        const d = res.data
            setName(d.name || d.modelName)
            setFramework(d.framework)
            setDescription(d.description || '')
          setUseCase(d.useCase)
          setDataset(d.dataset)
          setImage(d.image || '')
      }).catch(() => toast.show('Failed to load model')).finally(() => setLoading(false))
    }
  }, [editMode, id])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setSubmitting(true)
      const payload = { name, framework, description, useCase, dataset, image }
      if (editMode && id) {
        await api.updateModel(id, payload)
        toast.show('Model updated')
      } else {
        await api.createModel(payload)
        toast.show('Model created')
      }
      navigate('/')
    } catch (err) {
      toast.show(err.response?.data?.error || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="center"><Loader /></div>

  return (
    <div className="card">
      <h2>{editMode ? 'Edit model' : 'Add model'}</h2>
      <form onSubmit={handleSubmit}>
  <label>Model name</label>
  <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Framework</label>
        <input value={framework} onChange={e => setFramework(e.target.value)} required />

        <label>Use case</label>
          <input value={useCase} onChange={e => setUseCase(e.target.value)} required />

          <label>Short description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Write a short summary of the model (purpose, strengths)" />

  <label>Dataset</label>
  <input value={dataset} onChange={e => setDataset(e.target.value)} required />

  <label>Image URL</label>
  <input value={image} onChange={e => setImage(e.target.value)} required placeholder="https://i.imgur.com/..." />

        <div className="form-actions">
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
          <button className="btn muted" type="button" onClick={() => navigate('/')} disabled={submitting}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
