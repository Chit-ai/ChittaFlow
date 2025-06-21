# Chit.ai - Autonomous AI Agents for Startups

A comprehensive, full-stack platform for creating, managing, and deploying autonomous AI agents designed specifically for startups. Chit.ai is built with a freemium business model to maximize accessibility while generating high revenue through premium features.

## 🚀 Overview

Chit.ai empowers startups to leverage autonomous AI agents for various business functions including customer support, data analysis, marketing automation, and content generation. The platform implements a sophisticated freemium model that provides significant value in the free tier while offering advanced capabilities through premium subscriptions.

### Key Features

- **Autonomous AI Agents**: Deploy intelligent agents that can perform complex, multi-step tasks independently
- **Template Library**: Pre-built agent templates for common startup use cases
- **Real-time Execution Monitoring**: Track agent performance and execution history
- **Freemium Business Model**: Free tier with generous limits, premium tiers for advanced features
- **Scalable Architecture**: Cloud-native design supporting rapid growth
- **Modern Dashboard**: Intuitive React-based interface with real-time updates
- **RESTful API**: Complete API for programmatic access and integrations

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: SQLite (development), easily scalable to PostgreSQL/MySQL
- **AI Frameworks**: LangChain, CrewAI integration ready
- **API**: RESTful endpoints with CORS support
- **Authentication**: Ready for JWT implementation

### Frontend (React)
- **Framework**: React 18 with Vite
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Icons**: Lucide React icons
- **State Management**: React hooks
- **Responsive Design**: Mobile-first approach

### Database Schema
- **Users**: User accounts with premium status tracking
- **Agents**: AI agent configurations and metadata
- **Agent Templates**: Pre-built templates for quick deployment
- **Agent Executions**: Execution history and performance tracking

## 📋 Prerequisites

- Python 3.11+
- Node.js 20+
- npm or pnpm
- Git

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-agent-platform
   ```

2. **Set up Python virtual environment**
   ```bash
   cd ai-agent-platform
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database**
   ```bash
   python src/main.py
   # The database will be created automatically on first run
   ```

5. **Seed initial data**
   ```bash
   curl -X POST http://localhost:5000/api/seed-templates
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ai-agent-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev --host
   # or
   pnpm dev --host
   ```

## 🚀 Quick Start

### Starting the Backend
```bash
cd ai-agent-platform
source venv/bin/activate
python src/main.py
```
The backend will be available at `http://localhost:5000`

### Starting the Frontend
```bash
cd ai-agent-frontend
npm run dev --host
```
The frontend will be available at `http://localhost:5173`

### Creating Your First Agent

1. **Access the dashboard** at `http://localhost:5173`
2. **Click "Create Agent"** in the My Agents tab
3. **Select a template** from the available options
4. **Customize** the agent name and description
5. **Click "Create Agent"** to deploy

### Executing an Agent

1. **Navigate to My Agents** tab
2. **Click the play button** on any active agent
3. **View execution results** in the Executions tab

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Currently, the API uses a simplified authentication model with user ID parameters. Production deployment should implement JWT tokens.

### Endpoints

#### Users
- `GET /users` - List all users
- `POST /users` - Create a new user
- `GET /users/{id}` - Get user details
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

#### Agents
- `GET /agents?user_id={id}` - List user's agents
- `POST /agents` - Create a new agent
- `GET /agents/{id}` - Get agent details
- `PUT /agents/{id}` - Update agent
- `DELETE /agents/{id}` - Delete agent
- `POST /agents/{id}/execute` - Execute agent
- `GET /agents/{id}/executions` - Get execution history

#### Templates
- `GET /templates` - List all templates
- `POST /templates/{id}/create-agent` - Create agent from template
- `POST /seed-templates` - Seed initial templates

### Example API Calls

#### Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "startup_user", "email": "user@startup.com"}'
```

#### Create Agent from Template
```bash
curl -X POST http://localhost:5000/api/templates/1/create-agent \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Support Bot",
    "description": "Handles customer inquiries",
    "user_id": 1
  }'
```

#### Execute Agent
```bash
curl -X POST http://localhost:5000/api/agents/1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "input_data": {
      "message": "I need help with my order"
    }
  }'
```

## 🎯 Business Model

### Free Tier
- **5 agents maximum**
- **100 executions per month**
- **Basic templates only**
- **Community support**
- **Standard analytics**

### Pro Tier ($29/month)
- **50 agents maximum**
- **10,000 executions per month**
- **All templates including premium**
- **Priority email support**
- **Advanced analytics and reporting**
- **Custom integrations**

### Enterprise Tier ($99/month)
- **Unlimited agents**
- **Unlimited executions**
- **Custom agent development**
- **Dedicated support**
- **SLA guarantees**
- **On-premise deployment options**

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=sqlite:///app.db

# Flask Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True

# AI Service Configuration
OPENAI_API_KEY=your-openai-key
LANGCHAIN_API_KEY=your-langchain-key

# CORS Settings
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration

Update `src/services/api.js` for production:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api'
  : 'http://localhost:5000/api'
```

## 🚀 Deployment

### Backend Deployment

#### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
EXPOSE 5000

CMD ["python", "src/main.py"]
```

#### Using Cloud Platforms
- **Heroku**: Use the included `Procfile`
- **AWS**: Deploy using Elastic Beanstalk or ECS
- **Google Cloud**: Use App Engine or Cloud Run
- **DigitalOcean**: Use App Platform

### Frontend Deployment

#### Build for Production
```bash
npm run build
```

#### Deploy to Static Hosting
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload build files to S3 bucket with CloudFront
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 🧪 Testing

### Backend Tests
```bash
cd ai-agent-platform
source venv/bin/activate
python -m pytest tests/
```

### Frontend Tests
```bash
cd ai-agent-frontend
npm test
```

### Integration Tests
```bash
# Start both backend and frontend
# Run end-to-end tests
npm run test:e2e
```

## 📊 Monitoring and Analytics

### Built-in Analytics
- **Execution tracking**: Monitor agent performance and success rates
- **Usage metrics**: Track user engagement and feature adoption
- **Performance monitoring**: Response times and error rates
- **Business metrics**: Conversion rates and revenue tracking

### External Integrations
- **Google Analytics**: User behavior tracking
- **Mixpanel**: Event-based analytics
- **Sentry**: Error monitoring and performance tracking
- **DataDog**: Infrastructure monitoring

## 🔒 Security

### Current Implementation
- **CORS protection**: Configured for cross-origin requests
- **Input validation**: Basic validation on API endpoints
- **SQL injection protection**: SQLAlchemy ORM prevents SQL injection

### Production Recommendations
- **JWT Authentication**: Implement token-based authentication
- **Rate Limiting**: Prevent API abuse
- **HTTPS**: Use SSL certificates for all communications
- **Environment Variables**: Secure storage of sensitive configuration
- **Database Encryption**: Encrypt sensitive data at rest

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and test thoroughly
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Standards
- **Python**: Follow PEP 8 style guidelines
- **JavaScript**: Use ESLint and Prettier for formatting
- **Documentation**: Update README and API docs for any changes
- **Testing**: Include tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community Q&A and feature discussions

### Premium Support
- **Email Support**: Priority support for Pro and Enterprise users
- **Dedicated Support**: Enterprise customers get dedicated support channels
- **Custom Development**: Enterprise consulting services available

## 🗺️ Roadmap

### Q1 2025
- [ ] Advanced AI model integrations (GPT-4, Claude)
- [ ] Multi-agent collaboration features
- [ ] Enhanced security and authentication
- [ ] Mobile app development

### Q2 2025
- [ ] Marketplace for custom agents
- [ ] Advanced workflow automation
- [ ] Enterprise SSO integration
- [ ] Advanced analytics dashboard

### Q3 2025
- [ ] AI agent marketplace
- [ ] White-label solutions
- [ ] Advanced integrations (Slack, Teams, etc.)
- [ ] Multi-language support

## 📞 Contact

- **Website**: [Coming Soon]
- **Email**: support@aiagentplatform.com
- **Twitter**: @AIAgentPlatform
- **LinkedIn**: AI Agent Platform

---

**Built with ❤️ by Manus AI**

*Empowering startups with autonomous AI agents*

