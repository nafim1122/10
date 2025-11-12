import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/auth'

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const menuRef = useRef()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function toggleTheme(){
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="logo">ModelHub</Link>
        <Link to="/public">All Models</Link>
        <Link to="/add">Add Model</Link>
      </div>
      <nav>
        <button title="Toggle theme" onClick={toggleTheme} className="btn small" style={{marginRight:8}}>{theme === 'dark' ? '🌙' : '☀️'}</button>
        {user ? (
          <div className="profile-wrap" ref={menuRef}>
            <img src={user.photoURL || 'https://www.gravatar.com/avatar?d=mp'} alt="profile" className="avatar" onClick={() => setOpen(o => !o)} />
            {open && (
              <div className="dropdown">
                <div className="dropdown-user">
                  <div className="dropdown-name">{user.displayName || 'User'}</div>
                  <div className="dropdown-email">{user.email}</div>
                </div>
                <Link to="/purchase" onClick={() => setOpen(false)}>Model Purchase</Link>
                <Link to="/my-models" onClick={() => setOpen(false)}>My Models</Link>
                <Link to="/my-purchases" onClick={() => setOpen(false)}>My Purchases</Link>
                <button className="linkish" onClick={handleLogout}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </nav>
    </header>
  )
}
