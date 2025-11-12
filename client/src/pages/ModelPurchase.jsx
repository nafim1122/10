import React from 'react'

export default function ModelPurchase(){
  return (
    <div>
      <div className="card">
        <h2>Model Purchase</h2>
        <p>Browse premium models and purchase access. Payment integration is a future enhancement.</p>
      </div>
      <div className="card">
        <h3>Featured model packs</h3>
        <ul>
          <li>Vision Suite Pack — includes ImageNet-pretrained models</li>
          <li>NLP Suite Pack — includes transformer-based models</li>
          <li>Multimodal Suite — fusion models for text+image</li>
        </ul>
      </div>
    </div>
  )
}
