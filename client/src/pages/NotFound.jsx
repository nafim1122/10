import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound(){
  const navigate = useNavigate()
  return (
    <div className="card center">
      <h2>Oops! This AI model doesn’t exist.</h2>
      <p className="muted">We couldn't find what you're looking for. It may have been removed or the link is incorrect.</p>
      <div style={{marginTop:12}}>
        <button className="btn" onClick={() => navigate('/')}>Return to Home</button>
      </div>
    </div>
  )
}
