# 👽 Alien Recon Lab - CTF Platform

A modern, gamified Capture The Flag (CTF) platform with an alien-themed progression system.

## Project Overview

The Alien Recon Lab is a cybersecurity training platform that combines:
- 🎮 Engaging CTF challenges
- 👾 Unique alien-themed rank progression
- 📊 Real-time scoring and leaderboards
- 🔒 Secure authentication and data handling
- 🎯 Skill-based mission progression

## Architecture

### Frontend (React + TypeScript)
- Modern React with TypeScript
- Responsive UI with Tailwind CSS and shadcn/ui
- Real-time mission updates
- Interactive mission dashboards
- Dynamic leaderboard system
- Secure API integration

### Backend (Node.js + MongoDB)
- Express.js REST API
- MongoDB with Mongoose ODM
- JWT authentication
- Rate limiting and security features
- Activity logging system

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- MongoDB 5.0+
- Git

### Installation

Follow these steps:

```powershell
# Clone and setup frontend
git clone https://github.com/yourusername/alien-recon-portal-fullstack.git
cd alien-recon-portal-fullstack
npm install

# Setup and start backend
cd backend
npm install
npm run dev

# In a new terminal, start frontend
cd ..
npm run dev
```

## Project Structure

```
alien-recon-portal-fullstack/
├── src/                  # Frontend source
│   ├── components/       # React components
│   ├── services/        # API services
│   ├── hooks/           # Custom React hooks
│   └── pages/           # Route components
├── backend/             # Backend source
│   ├── src/
│   │   ├── config/     # Server configuration
│   │   ├── models/     # Database models
│   │   ├── routes/     # API endpoints
│   │   └── scripts/    # Utility scripts
└── public/             # Static assets
```

## Environment Setup

1. **Frontend (.env):**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. **Backend (.env):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/alien-recon-lab
   JWT_SECRET=your-secure-secret-key
   PORT=5000
   NODE_ENV=development
   ```

## Features

### For Players
- Progressive mission system with unlockable challenges
- Real-time scoring and rank progression
- Interactive leaderboards
- Skill development tracking across multiple domains
- Secure flag submission system
- Detailed mission history and achievements

### For Admins
- Comprehensive mission management
- User activity monitoring
- Progress tracking and analytics
- Security event logging
- Performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
