# Talent Bridge - AI Interview Practice App

An AI-powered interview practice platform for fresh graduates in India. Practice with voice-first AI and track your progress.

## Features

- 🎤 Voice-first interview practice
- 📊 Real-time feedback and evaluation  
- 📈 Progress tracking dashboard
- 🤖 AI-generated questions based on your industry/role
- 📱 WhatsApp-ready (web app MVP complete)

## Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React + Vite
- **Database:** Firebase Firestore (optional)
- **AI:** KiloCode CLI / Gemini (configurable)

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
talent-bridge/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── routes/
│   │   ├── interview.py # Interview endpoints
│   │   └── user.py      # User endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Setup.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── Feedback.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Interview Flow

1. **Home** → Welcome screen
2. **Setup** → Select industry & role
3. **Interview** → Answer 10 questions
4. **Feedback** → Get detailed scores
5. **Dashboard** → Track progress

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/start` | Start new interview |
| GET | `/api/interview/{id}` | Get interview |
| POST | `/api/interview/answer` | Submit answer |
| GET | `/api/interview/{id}/report` | Get final report |
| POST | `/api/user/register` | Register user |
| GET | `/api/user/{id}/stats` | Get user stats |

## Environment Variables

Create `.env` file in backend:

```
GOOGLE_API_KEY=your_google_api_key
FIREBASE_PROJECT=your_project_id
WHATSAPP_TOKEN=your_whatsapp_token
```

## WhatsApp Integration

To enable WhatsApp, register your webhook:

```
your-domain.com/whatsapp/webhook
```

## Next Steps

- [ ] Add real AI evaluation (Gemini/Claude)
- [ ] Add STT (speech-to-text)
- [ ] Add TTS (text-to-speech)
- [ ] Implement V2 live audio
- [ ] Implement V3 video + body language
- [ ] Add admin console

## License

MIT

---

Built with ❤️ using KiloCode CLI