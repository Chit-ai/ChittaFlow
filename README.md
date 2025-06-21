# Chit.ai

🤖 **Autonomous AI Agents for Startups**

A comprehensive, full-stack platform for creating, managing, and deploying autonomous AI agents designed specifically for startups. Chit.ai is built with a freemium business model to maximize accessibility while generating high revenue through premium features.

## 🚀 Quick Start

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

## 📁 Project Structure

```
chit-ai/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── firebase.json  # Firebase hosting config
│   └── package.json   # Dependencies
├── backend/           # Flask backend API
│   ├── src/          # Source code
│   ├── Dockerfile    # Container configuration
│   ├── Procfile      # Heroku deployment
│   ├── app.yaml      # Google App Engine config
│   └── requirements.txt
└── docs/             # Documentation
    ├── README.md     # Detailed documentation
    ├── DEPLOYMENT.md # Deployment guide
    └── USER_MANUAL.md # User guide
```

## 🌐 Deployment Options

### Frontend Deployment
- **Firebase Hosting** (Recommended)
- **Vercel**
- **Netlify**
- **GitHub Pages**

### Backend Deployment
- **Heroku** (Free tier available)
- **Google App Engine**
- **Railway**
- **Render**

## 🔧 CI/CD Ready

This project includes:
- GitHub Actions workflows
- Docker configurations
- Firebase deployment configs
- Heroku deployment files
- Environment variable templates

## 💰 Business Model

- **Free Tier**: 5 agents, 100 executions/month
- **Pro Tier**: $29/month, 50 agents, 10K executions
- **Enterprise**: $99/month, unlimited usage

## 📊 Revenue Potential

- **Year 1**: $233,400 annually (conservative)
- **Year 2**: $1,629,600 annually (optimistic)
- **Profit Margin**: 60-75% at scale

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons

**Backend:**
- Flask
- SQLAlchemy
- Flask-CORS
- LangChain
- CrewAI

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Made with ❤️ for the startup community**

