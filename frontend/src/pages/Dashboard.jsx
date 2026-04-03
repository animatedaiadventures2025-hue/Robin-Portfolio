import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total_interviews: 0,
    avg_score: 0,
    best_score: 0,
    day_streak: 0
  })
  const [history, setHistory] = useState([])
  
  useEffect(() => {
    const interviewHistory = JSON.parse(localStorage.getItem('interviewHistory') || '[]')
    setHistory(interviewHistory)
    
    if (interviewHistory.length > 0) {
      const scores = interviewHistory.map(i => i.score)
      let total = 0
      for (let i = 0; i < scores.length; i++) {
        total += scores[i]
      }
      const avgScore = Math.round((total / scores.length) * 10) / 10
      let best = scores[0]
      for (let i = 1; i < scores.length; i++) {
        if (scores[i] > best) best = scores[i]
      }
      setStats({
        total_interviews: interviewHistory.length,
        avg_score: avgScore,
        best_score: best,
        day_streak: interviewHistory.length
      })
    }
  }, [])
  
  return (
    <div className="page dashboard-page">
      <div className="container">
        <h2>My Progress</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.total_interviews}</span>
            <span className="stat-label">Interviews</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">{stats.avg_score || '-'}</span>
            <span className="stat-label">Avg Score</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">{stats.best_score || '-'}</span>
            <span className="stat-label">Best Score</span>
          </div>
        </div>
        
        <div className="history-section">
          <h3>Recent Interviews</h3>
          
          {history.length === 0 ? (
            <div className="empty-state">
              <p>No interviews yet.</p>
              <p>Start practicing to track your progress!</p>
            </div>
          ) : (
            <div className="history-list">
              {history.slice().reverse().map((interview, index) => (
                <div key={index} className="history-item">
                  <div className="history-info">
                    <span className="history-role">{interview.role}</span>
                    <span className="history-industry">{interview.industry}</span>
                  </div>
                  <span className="history-score">{interview.score}/10</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Link to="/setup" className="btn-primary">
          Start New Interview
        </Link>
        
        <div className="back-link">
          <span onClick={() => navigate('/')}>← Back to Home</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard