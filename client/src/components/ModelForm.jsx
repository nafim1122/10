import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useToast } from './Toast'
import Loader from './Loader'
import axios from 'axios'

export default function ModelForm({ editMode }) {
  const [name, setName] = useState('')
  const [framework, setFramework] = useState('')
  const [description, setDescription] = useState('')
  const [useCase, setUseCase] = useState('')
  const [dataset, setDataset] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
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

  async function handleImageFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY
    if (!apiKey) {
      toast.show('Image upload key not configured. Please set VITE_IMGBB_API_KEY.')
      return
    }
    try {
      setUploadingImage(true)
      const toBase64 = (f) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(f)
      })
      const base64Image = await toBase64(file)
      const fd = new FormData()
      fd.append('image', base64Image)
      const url = `https://api.imgbb.com/1/upload?key=${apiKey}`
      const res = await axios.post(url, fd)
      const data = res.data && res.data.data
      const uploadedUrl = (data && (data.display_url || data.url)) || ''
      if (uploadedUrl) {
        setImage(uploadedUrl)
        toast.show('Image uploaded successfully')
      } else {
        toast.show('Image upload failed')
      }
    } catch (err) {
      toast.show('Image upload failed')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setSubmitting(true)
      if (!image) {
        toast.show('Please provide an image URL or upload an image')
        setSubmitting(false)
        return
      }
      const payload = { name, framework, description, useCase, dataset, image }
      if (editMode && id) {
        await api.updateModel(id, payload)
        toast.show('Model updated')
        navigate(`/models/${id}`)
      } else {
        await api.createModel(payload)
        toast.show('Model created')
        navigate('/models')
      }
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

  <label>Image URL (optional if you upload)</label>
  <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://i.imgur.com/..." />

  <label>Upload Image</label>
  <input type="file" accept="image/*" onChange={handleImageFileChange} />
  {uploadingImage && <div className="muted">Uploading image…</div>}
        <div className="form-actions">
          <button className="btn" type="submit" disabled={submitting || uploadingImage}>{submitting ? 'Saving…' : 'Save'}</button>
          <button className="btn muted" type="button" onClick={() => navigate('/models')} disabled={submitting}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
