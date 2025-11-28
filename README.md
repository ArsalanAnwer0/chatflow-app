# ChatFlow - AI-Powered Chat Application

A full-stack AI chat application similar to ChatGPT, built with React, Node.js, MongoDB, Redis, and Ollama.

## Architecture

ChatFlow is a microservices-based application with the following components:

- **Frontend**: React + Vite (served via nginx in production)
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB for conversation persistence
- **Cache**: Redis for session management
- **AI Engine**: Ollama (local LLM) with phi/tinyllama models

## Project Structure

```
chatflow-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & Redis configuration
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic (Ollama integration)
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # CORS, error handling
│   │   └── server.js       # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile          # Multi-stage build (Node + nginx)
│   ├── package.json
│   └── .env.example
│
└── docker-compose.yml      # Orchestrates all 5 services
```

## Technology Stack

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js
- **Database ODM**: Mongoose
- **Cache**: Redis client
- **AI Integration**: Ollama API (axios for streaming)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios + Fetch (for SSE streaming)
- **Styling**: CSS

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: nginx (for frontend in production)
- **AI Model**: Ollama phi (2GB) or tinyllama (637MB)

## Local Development Setup

### Prerequisites
- Docker & Docker Compose installed
- 4GB+ RAM (for phi model) or 2GB+ (for tinyllama)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArsalanAnwer0/chatflow-app.git
   cd chatflow-app
   ```

2. **Configure environment variables**
   ```bash
   # Backend - no changes needed for local development
   cp backend/.env.example backend/.env

   # Frontend - update API URL
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env: VITE_API_URL=http://localhost:5001/api
   ```

3. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

4. **Pull AI model** (one-time setup)
   ```bash
   # For 4GB+ RAM systems
   docker exec -it chatflow-ollama ollama pull phi

   # For 2-4GB RAM systems
   docker exec -it chatflow-ollama ollama pull tinyllama
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api

### Verify Services

```bash
# Check all containers are running
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Test backend health
curl http://localhost:5001/api/conversations
```

## Production Deployment (AWS EC2)

### Prerequisites
- AWS EC2 instance (t2.medium or higher)
- Docker & Docker Compose installed on EC2
- Security Groups: Open ports 3000, 5001

### Deployment Steps

1. **SSH into EC2 instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Clone repository**
   ```bash
   git clone https://github.com/ArsalanAnwer0/chatflow-app.git
   cd chatflow-app
   ```

3. **Configure frontend with EC2 public IP**
   ```bash
   echo "VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:5001/api" > frontend/.env
   ```

4. **Start services**
   ```bash
   docker-compose up -d --build
   ```

5. **Pull AI model**
   ```bash
   docker exec -it chatflow-ollama ollama pull phi
   ```

6. **Access application**
   ```
   http://YOUR_EC2_PUBLIC_IP:3000
   ```

## API Endpoints

### Conversations
- `GET /api/conversations` - List all conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation by ID
- `DELETE /api/conversations/:id` - Delete conversation

### Messages
- `POST /api/conversations/:id/messages` - Send message (SSE streaming response)

### Models
- `GET /api/models` - List available Ollama models

## Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://mongodb:27017/chatflow
REDIS_HOST=redis
REDIS_PORT=6379
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=phi
CORS_ORIGIN=*
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5001/api
```

## Docker Services

The `docker-compose.yml` orchestrates 5 services:

| Service | Image | Port | Volume | Purpose |
|---------|-------|------|--------|---------|
| mongodb | mongo:latest | 27017 | mongodb_data | Database |
| redis | redis:alpine | 6379 | - | Cache |
| ollama | ollama/ollama | 11434 | ollama_data | AI Engine |
| backend | Custom (./backend) | 5001:5000 | - | REST API |
| frontend | Custom (./frontend) | 3000:80 | - | UI |

## Features

- Real-time AI chat with streaming responses (Server-Sent Events)
- Conversation history persistence
- Multiple conversation support
- Model selection (phi, tinyllama, llama3.2)
- Responsive UI
- RESTful API architecture

## Troubleshooting

### Issue: "Ollama model requires more system memory"
**Solution**: Switch to smaller model
```bash
docker exec -it chatflow-ollama ollama pull tinyllama
# Update backend/.env: OLLAMA_MODEL=tinyllama
docker-compose restart backend
```

### Issue: Frontend can't connect to backend
**Solution**: Verify frontend .env has correct API URL
```bash
# Rebuild frontend after changing .env
docker-compose build frontend
docker-compose up -d frontend
```

### Issue: MongoDB connection failed
**Solution**: Ensure MongoDB container is healthy
```bash
docker-compose logs mongodb
docker-compose restart mongodb
```

## Next Steps

- **Phase 3**: Kubernetes deployment (chatflow-k8s-manifests repo)
- **Phase 4**: Infrastructure as Code with Terraform (chatflow-infrastructure repo)
- **Phase 5**: CI/CD pipeline with Jenkins
- **Phase 6**: GitOps with ArgoCD

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Repository Structure

This is part of the ChatFlow project with 3 repositories:
- **chatflow-app** (this repo): Application code
- **chatflow-k8s-manifests**: Kubernetes YAML manifests
- **chatflow-infrastructure**: Terraform configurations