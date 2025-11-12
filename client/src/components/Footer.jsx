import React from 'react'

export default function Footer(){
  return (
    <footer className="card" style={{marginTop:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <strong>ModelHub</strong> — AI Model Inventory
          <div className="muted">© {new Date().getFullYear()} ModelHub</div>
        </div>
        <div>
          <a href="#" target="_blank">GitHub Client</a> &nbsp;|&nbsp; <a href="#" target="_blank">GitHub Server</a>
          &nbsp;|&nbsp;
          <a href="#" target="_blank" aria-label="X (formerly Twitter)" className="social-x">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M22 3L13 12.5L22 21" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 3L11 12.5L2 21" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
