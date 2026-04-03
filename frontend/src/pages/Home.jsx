import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page home-page">
      <div className="container">
        <div className="logo">
          <span className="logo-icon">🤖</span>
          <h1>TALENT BRIDGE</h1>
        </div>
        
        <p className="tagline">
          Master Your Interview.<br />
          Land Your Dream Job.
        </p>
        
        <div className="features">
          <div className="feature">
            <span>🎤</span>
            <p>Practice with AI</p>
          </div>
          <div className="feature">
            <span>📊</span>
            <p>Get real-time feedback</p>
          </div>
          <div className="feature">
            <span>🎯</span>
            <p>Track your progress</p>
          </div>
        </div>
        
        <Link to="/setup" className="btn-primary">
          Start Free Practice
        </Link>
        
        <div className="secondary-links">
          <Link to="/dashboard">My Progress</Link>
        </div>
      </div>
    </div>
  )
}

export default Home