import React from 'react'

export default function ConfirmDialog({ open, title, onConfirm, onCancel }){
  if (!open) return null
  return (
    <div className="confirm-backdrop">
      <div className="confirm-card card">
        <h3>{title}</h3>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
          <button className="btn muted" onClick={onCancel}>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
