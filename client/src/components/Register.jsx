import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../services/auth'
import { useToast } from './Toast'
import { auth } from '../services/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function Register(){
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = (() => {
    const from = location.state && location.state.from && location.state.from.pathname
    if (from) return from
    const qp = new URLSearchParams(location.search).get('redirect')
    return qp || '/'
  })()

  async function handleSubmit(e){
    e.preventDefault()
    // password validation: at least one uppercase, one lowercase, min 6 chars
    const valid = /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length >= 6
    if (!valid) {
      toast.show('Password must be at least 6 characters and include both uppercase and lowercase letters')
      return
    }
    try{
      setSubmitting(true)
      await register(email, password, name, photo)
      toast.show('Account created')
      navigate(redirectTo, { replace: true })
    }catch(err){
      // friendly error message for common cases
      const msg = (err && err.code === 'auth/email-already-in-use') ? 'Email already in use' : (err.message || 'Registration failed')
      toast.show(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle(){
    try{
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast.show('Signed in with Google')
      navigate('/', { replace: true })
    }catch(err){
      toast.show('Google sign-in failed')
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} type="text" required />

        <label>Photo URL</label>
        <input value={photo} onChange={e=>setPhoto(e.target.value)} type="url" placeholder="https://example.com/photo.jpg" />

        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        <div className="muted" style={{fontSize:12,marginTop:6}}>Password must be 6+ characters and include uppercase and lowercase letters.</div>
        <div style={{marginTop:8}}>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Register'}</button>
        </div>
      </form>
      <div style={{marginTop:12}}>
        <button className="btn" onClick={handleGoogle} disabled={submitting}>Sign in with Google</button>
      </div>

      <div className="muted" style={{marginTop:12}}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  )
}
