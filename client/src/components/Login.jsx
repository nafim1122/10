import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../services/auth'
import { useToast } from './Toast'
import { auth } from '../services/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = (() => {
    // prefer location.state.from, fallback to ?redirect= query param, else /
    const from = location.state && location.state.from && location.state.from.pathname
    if (from) return from
    const qp = new URLSearchParams(location.search).get('redirect')
    return qp || '/'
  })()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login(email, password)
      toast.show('Signed in successfully')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.show('Invalid email or password')
    }
  }

  async function handleGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast.show('Signed in with Google')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.show('Google sign-in failed')
    }
  }

  return (
    <div className="card">
      <h2>Login to AI Model Inventory Manager</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
          <Link to="#" className="muted">Forget Password?</Link>
          <button type="submit" className="btn">Login</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        <button className="btn" onClick={handleGoogle}>Sign in with Google</button>
      </div>

      <div className="muted" style={{marginTop:12}}>
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  )
}
