import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock questions database (same as backend)
const questionsDb = {
  it_services: {
    software_engineer: [
      "Tell me about a project you worked on.",
      "What is your greatest strength as a developer?",
      "Describe a challenging bug you solved.",
      "How do you handle tight deadlines?",
      "Tell me about a time you worked in a team.",
      "What programming languages are you proficient in?",
      "Describe your approach to code reviews.",
      "How do you keep up with new technologies?",
      "Tell me about a time you failed and what you learned.",
      "Why do you want to work in IT services?"
    ],
    data_scientist: [
      "Tell me about a data project you've worked on.",
      "What machine learning algorithms are you familiar with?",
      "How do you handle missing data?",
      "Describe a time you made data-driven decisions.",
      "What tools do you use for data visualization?",
      "How do you validate your models?",
      "Tell me about a challenging analysis you did.",
      "What is your approach to feature engineering?",
      "How do you communicate findings to non-tech stakeholders?",
      "Why data science?"
    ]
  },
  product: {
    product_manager: [
      "Tell me about a product you launched.",
      "How do you prioritize features?",
      "Describe a time you pivoted a strategy.",
      "How do you gather customer feedback?",
      "Tell me about a failed product and what you learned.",
      "How do you work with engineers?",
      "What metrics do you track?",
      "Describe your ideal product team.",
      "How do you handle competing priorities?",
      "Why product management?"
    ]
  },
  banking: {
    analyst: [
      "Tell me about a financial analysis you've done.",
      "How do you assess risk?",
      "Describe a time you improved a process.",
      "What financial modeling experience do you have?",
      "How do you stay updated on market trends?",
      "Tell me about a deal you worked on.",
      "What tools do you use for analysis?",
      "How do you handle pressure?",
      "Why banking?",
      "Where do you see the finance industry heading?"
    ]
  },
  consulting: {
    consultant: [
      "Tell me about a problem you solved for a client.",
      "How do you approach new projects?",
      "Describe a time you had to learn quickly.",
      "How do you handle difficult clients?",
      "Tell me about a team project.",
      "What industries interest you?",
      "How do you structure your analysis?",
      "Why consulting?",
      "Where do you see yourself in 5 years?",
      "What is your biggest strength?"
    ]
  },
  marketing: {
    marketing_manager: [
      "Tell me about a campaign you ran.",
      "How do you measure campaign success?",
      "Describe a time you innovated.",
      "How do you understand customer needs?",
      "What digital marketing tools do you use?",
      "Tell me about a failed campaign.",
      "How do you allocate budget?",
      "What channels do you prefer and why?",
      "Why this company?",
      "Where do you see digital marketing heading?"
    ]
  },
  healthcare: {
    healthcare_manager: [
      "Tell me about your healthcare experience.",
      "How do you handle patient concerns?",
      "Describe a time you improved processes.",
      "What EHR systems have you used?",
      "How do you ensure compliance?",
      "Tell me about working with doctors.",
      "What is patient-centered care to you?",
      "How do you handle emergencies?",
      "Why healthcare?",
      "Where do you see healthcare heading?"
    ]
  },
  manufacturing: {
    operations_manager: [
      "Tell me about a production project.",
      "How do you ensure quality?",
      "Describe a time you reduced costs.",
      "What manufacturing processes do you know?",
      "How do you handle supply chain issues?",
      "Tell me about a team you led.",
      "What metrics do you track?",
      "How do you handle safety?",
      "Why manufacturing?",
      "Where do you see the industry?"
    ]
  },
  education: {
    teacher: [
      "Tell me about your teaching style.",
      "How do you handle difficult students?",
      "Describe a lesson that didn't work.",
      "How do you assess student progress?",
      "What technology do you use in class?",
      "Tell me about a success story.",
      "How do you engage parents?",
      "Why teaching?",
      "Where do you see education heading?",
      "What is your greatest strength?"
    ]
  }
}

const defaultQuestions = [
  "Tell me about yourself.",
  "What is your greatest strength?",
  "What is your greatest weakness?",
  "Why do you want to work here?",
  "Where do you see yourself in 5 years?",
  "Tell me about a challenge you overcame.",
  "What are your salary expectations?",
  "Why should we hire you?",
  "Do you have any questions for us?",
  "Is there anything you'd like to add?"
]

function Interview() {
  const navigate = useNavigate()
  const [interview, setInterview] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState([])
  
  useEffect(() => {
    const stored = localStorage.getItem('currentInterview')
    if (stored) {
      const data = JSON.parse(stored)
      setInterview(data)
      setQuestionIndex(data.questionIndex || 0)
      setAnswers(data.answers || [])
    } else {
      navigate('/setup')
    }
  }, [])
  
  const getQuestions = (industry, role) => {
    const industryQs = questionsDb[industry] || {}
    const roleQs = industryQs[role] || defaultQuestions
    // Shuffle and pick 10
    const shuffled = [...roleQs].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 10)
  }
  
  const handleRecord = () => {
    if (recording) {
      setRecording(false)
      clearInterval(window.recordingTimer)
      submitAnswer()
    } else {
      setRecording(true)
      setRecordingTime(0)
      window.recordingTimer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }
  
  const submitAnswer = () => {
    setLoading(true)
    
    // Generate mock answer and evaluation
    const mockEvaluation = {
      score: Math.floor(Math.random() * 3) + 6, // 6-8
      strengths: ["Clear response", "Good examples"],
      improvements: ["Add more details", "Speak slower"]
    }
    
    const newAnswers = [...answers, {
      question: interview.questions[questionIndex],
      answer: "Sample answer",
      evaluation: mockEvaluation
    }]
    
    const updatedInterview = {
      ...interview,
      questionIndex: questionIndex + 1,
      answers: newAnswers
    }
    
    localStorage.setItem('currentInterview', JSON.stringify(updatedInterview))
    
    // Check if complete
    if (questionIndex + 1 >= interview.questions.length) {
      // Save score for history
      const totalScore = newAnswers.reduce((sum, a) => sum + a.evaluation.score, 0) / newAnswers.length
      const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]')
      history.push({
        id: Date.now().toString(),
        score: Math.round(totalScore * 10) / 10,
        industry: interview.industry,
        role: interview.role,
        date: new Date().toISOString()
      })
      localStorage.setItem('interviewHistory', JSON.stringify(history))
      
      navigate('/feedback')
    } else {
      setQuestionIndex(questionIndex + 1)
      setAnswers(newAnswers)
    }
    
    setLoading(false)
  }
  
  const handleSkip = () => {
    const newAnswers = [...answers, { skipped: true, question: interview.questions[questionIndex] }]
    const updatedInterview = { ...interview, questionIndex: questionIndex + 1, answers: newAnswers }
    localStorage.setItem('currentInterview', JSON.stringify(updatedInterview))
    
    if (questionIndex + 1 >= interview.questions.length) {
      navigate('/feedback')
    } else {
      setQuestionIndex(questionIndex + 1)
      setAnswers(newAnswers)
    }
  }
  
  const handleRepeat = () => {
    alert('Question: ' + interview?.questions[questionIndex])
  }
  
  if (!interview) {
    return <div className="page"><div className="container">Loading...</div></div>
  }
  
  const totalQuestions = interview.questions?.length || 10
  const currentQuestion = interview.questions?.[questionIndex] || `Question ${questionIndex + 1}`
  
  return (
    <div className="page interview-page">
      <div className="container">
        <div className="header">
          <span className="mode-tag">🎤 Interview Mode</span>
          <span className="progress">Question {questionIndex + 1} of {totalQuestions}</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((questionIndex) / totalQuestions) * 100}%` }}
          />
        </div>
        
        <div className="question-box">
          <p className="question-text">{currentQuestion}</p>
        </div>
        
        <div className="recorder">
          <button 
            className={`record-btn ${recording ? 'recording' : ''}`}
            onClick={handleRecord}
            disabled={loading}
          >
            {recording ? (
              <>⏹️ Stop ({recordingTime}s)</>
            ) : (
              <>🎤 Tap to Record</>
            )}
          </button>
          
          {recording && (
            <p className="recording-hint">Speak your answer...</p>
          )}
        </div>
        
        <div className="actions">
          <button className="btn-secondary" onClick={handleRepeat}>
            🔁 Repeat
          </button>
          <button className="btn-secondary" onClick={handleSkip}>
            ⏭️ Skip
          </button>
        </div>
        
        <div className="back-link">
          <span onClick={() => navigate('/')}>← End Interview</span>
        </div>
      </div>
    </div>
  )
}

export default Interview