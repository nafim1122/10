import React from 'react'

export default function Loader({ size = 40 }){
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:16}}>
      <div className="spinner" style={{width:size,height:size}} aria-hidden="true"></div>
    </div>
  )
}
