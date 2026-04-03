import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const industries = [
  { id: 'it_services', name: 'IT Services & Software' },
  { id: 'product', name: 'Product Companies' },
  { id: 'banking', name: 'Banking & Finance' },
  { id: 'consulting', name: 'Consulting' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'education', name: 'Education' }
]

const roles = {
  it_services: [
    { id: 'software_engineer', name: 'Software Engineer (SDE)' },
    { id: 'data_scientist', name: 'Data Scientist' },
    { id: 'qa_engineer', name: 'QA Engineer' },
    { id: 'devops_engineer', name: 'DevOps Engineer' }
  ],
  product: [
    { id: 'product_manager', name: 'Product Manager' },
    { id: 'product_owner', name: 'Product Owner' },
    { id: 'project_manager', name: 'Project Manager' }
  ],
  banking: [
    { id: 'analyst', name: 'Financial Analyst' },
    { id: 'relationship_manager', name: 'Relationship Manager' },
    { id: 'risk_manager', name: 'Risk Manager' }
  ],
  consulting: [
    { id: 'consultant', name: 'Consultant' },
    { id: 'senior_consultant', name: 'Senior Consultant' }
  ],
  marketing: [
    { id: 'marketing_manager', name: 'Marketing Manager' },
    { id: 'digital_marketing', name: 'Digital Marketing' },
    { id: 'content_marketing', name: 'Content Marketing' }
  ],
  healthcare: [
    { id: 'healthcare_manager', name: 'Healthcare Manager' },
    { id: 'hospital_admin', name: 'Hospital Administrator' }
  ],
  manufacturing: [
    { id: 'operations_manager', name: 'Operations Manager' },
    { id: 'production_manager', name: 'Production Manager' },
    { id: 'quality_manager', name: 'Quality Manager' }
  ],
  education: [
    { id: 'teacher', name: 'Teacher' },
    { id: 'principal', name: 'Principal' },
    { id: 'education_manager', name: 'Education Manager' }
  ]
}

// Questions database (same as Interview.jsx)
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

function Setup() {
  const navigate = useNavigate()
  const [industry, setIndustry] = useState('')
  const [role, setRole] = useState('')
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleStart = async () => {
    if (!industry || !role) return
    
    setLoading(true)
    
    // Generate questions locally (no backend needed)
    const industryQs = questionsDb[industry] || {}
    const roleQs = industryQs[role] || defaultQuestions
    const shuffled = [...roleQs].sort(() => 0.5 - Math.random())
    const questions = shuffled.slice(0, 10)
    
    // Save to localStorage
    const interviewData = {
      id: Date.now().toString(),
      industry,
      role,
      jd,
      questions,
      questionIndex: 0,
      answers: []
    }
    
    localStorage.setItem('currentInterview', JSON.stringify(interviewData))
    navigate('/interview')
    setLoading(false)
  }
  
  return (
    <div className="page setup-page">
      <div className="container">
        <h2>Setup Your Interview</h2>
        
        <div className="form-group">
          <label>Target Industry</label>
          <select 
            value={industry} 
            onChange={(e) => { setIndustry(e.target.value); setRole(''); }}
          >
            <option value="">Select Industry</option>
            {industries.map(ind => (
              <option key={ind.id} value={ind.id}>{ind.name}</option>
            ))}
          </select>
        </div>
        
        {industry && (
          <div className="form-group">
            <label>Target Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles[industry]?.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {industry && (
          <div className="form-group">
            <label>Job Description (Optional)</label>
            <textarea
              placeholder="Paste your JD here for personalized questions..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={4}
            />
          </div>
        )}
        
        {industry && role && (
          <button 
            className="btn-primary" 
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Start Interview'}
          </button>
        )}
        
        <div className="back-link">
          <span onClick={() => navigate('/')}>← Back to Home</span>
        </div>
      </div>
    </div>
  )
}

export default Setup