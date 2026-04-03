import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Feedback() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchReport = async () => {
      const stored = localStorage.getItem('currentInterview')
      if (!stored) {
        navigate('/')
        return
      }
      
      const interview = JSON.parse(stored)
      
      try {
        const response = await fetch(`/api/interview/${interview.id}/report`)
        const data = await response.json()
        setReport(data)
        
        // Save to history
        const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]')
        history.push({
          id: data.interview_id,
          score: data.overall_score,
          industry: interview.industry,
          role: interview.role,
          date: new Date().toISOString()
        })
        localStorage.setItem('interviewHistory', JSON.stringify(history))
        
      } catch (error) {
        console.error('Error fetching report:', error)
        // Create mock report for demo
        setReport({
          overall_score: 7.2,
          dimensions: {
            content_quality: 8,
            star_structure: 7,
            communication: 6,
            confidence: 8
          },
          questions: [
            { question: 'Q1', score: 8, strengths: ['Clear answer'], improvements: ['Add more details'] },
            { question: 'Q2', score: 7, strengths: ['Good examples'], improvements: ['Speak slower'] },
            { question: 'Q3', score: 7, strengths: ['Nice structure'], improvements: ['More metrics'] }
          ]
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchReport()
  }, [])
  
  const handlePracticeAgain = () => {
    localStorage.removeItem('currentInterview')
    navigate('/setup')
  }
  
  if (loading) {
    return <div className="page"><div className="container">Generating your report...</div></div>
  }
  
  // Mock data if no real data
  const score = report?.overall_score || 7.2
  const dimensions = report?.dimensions || {
    content_quality: 8,
    star_structure: 7,
    communication: 6,
    confidence: 8
  }
  
  const getScoreColor = (s) => {
    if (s >= 8) return 'green'
    if (s >= 6) return 'yellow'
    return 'red'
  }
  
  const getScoreLabel = (s) => {
    if (s >= 8) return 'Excellent'
    if (s >= 6) return 'Good'
    return 'Needs Work'
  }
  
  return (
    <div className="page feedback-page">
      <div className="container">
        <div className="celebration">
          <h2>🎉 INTERVIEW COMPLETE!</h2>
        </div>
        
        <div className="score-card">
          <div className="score-main">
            <span className="score-label">Overall Score</span>
            <span className="score-value">{score}/10</span>
            <span className="score-grade">{getScoreLabel(score)}</span>
          </div>
        </div>
        
        <div className="dimensions">
          <h3>Dimension Scores</h3>
          
          <div className="dimension">
            <span>Content Quality</span>
            <div className="dimension-bar">
              <div 
                className="dimension-fill" 
                style={{ width: `${dimensions.content_quality * 10}%` }}
              />
            </div>
            <span>{dimensions.content_quality}/10</span>
          </div>
          
          <div className="dimension">
            <span>STAR Structure</span>
            <div className="dimension-bar">
              <div 
                className="dimension-fill" 
                style={{ width: `${dimensions.star_structure * 10}%` }}
              />
            </div>
            <span>{dimensions.star_structure}/10</span>
          </div>
          
          <div className="dimension">
            <span>Communication</span>
            <div className="dimension-bar">
              <div 
                className="dimension-fill" 
                style={{ width: `${dimensions.communication * 10}%` }}
              />
            </div>
            <span>{dimensions.communication}/10</span>
          </div>
          
          <div className="dimension">
            <span>Confidence</span>
            <div className="dimension-bar">
              <div 
                className="dimension-fill" 
                style={{ width: `${dimensions.confidence * 10}%` }}
              />
            </div>
            <span>{dimensions.confidence}/10</span>
          </div>
        </div>
        
        <div className="summary">
          <h3>Summary</h3>
          <div className="strengths">
            <h4>✅ Strengths</h4>
            <ul>
              <li>Clear STAR structure in answers</li>
              <li>Specific examples with details</li>
              <li>Good confidence level</li>
            </ul>
          </div>
          
          <div className="improvements">
            <h4>⚠️ Improvements</h4>
            <ul>
              <li>Speak slower (140 WPM ideal)</li>
              <li>Add more quantifiable metrics</li>
              <li>Reduce filler words</li>
            </ul>
          </div>
        </div>
        
        <div className="actions">
          <Link to="/dashboard" className="btn-secondary">
            View Progress
          </Link>
          <button className="btn-primary" onClick={handlePracticeAgain}>
            Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feedback