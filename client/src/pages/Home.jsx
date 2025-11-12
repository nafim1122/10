import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Slider from '../components/Slider'

function FeaturedCard({ model }){
  return (
    <div className="card">
      {model.image && <img className="card-img" src={model.image} alt={model.name} />}
      <h3 className="card-title">{model.name || model.modelName}</h3>
      <p className="muted"><strong>{model.framework}</strong></p>
      {model.description && <p>{model.description}</p>}
    </div>
  )
}

export default function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/public/models`
    setLoading(true)
    axios.get(url).then(res => {
      setItems(res.data.slice(0,6))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <Slider />

      <section>
        <h2>Featured AI Models</h2>
        {loading ? (
          <div className="center">Loading featured models…</div>
        ) : (
          <div className="grid">
            {items.map(m => <FeaturedCard key={m._id} model={m} />)}
          </div>
        )}
      </section>

      <section className="card" style={{marginTop:16}}>
        <h2>About AI Models</h2>
        <p>AI models are mathematical constructs trained on data to perform tasks such as classification, generation, or prediction. Modern models like neural networks learn patterns from large datasets and power applications including chatbots, image recognition systems, recommendation engines, and language translation.</p>
        <p>Understanding a model's framework, training dataset, and intended use helps you choose the right model for a problem and evaluate its limitations.</p>
      </section>

      <section className="card" style={{marginTop:16}}>
        <h2>Get Started</h2>
        <p>Register or sign in to start adding and managing AI models in your inventory. Keep track of frameworks, datasets, and use cases in a single place.</p>
        <Link to="/login" className="btn">Register / Sign in</Link>
      </section>
    </div>
  )
}
