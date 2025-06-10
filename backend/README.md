
# Alien Recon Lab - Backend API

A secure MongoDB-based backend for the Alien Recon Lab CTF platform.

## Features

- 🔐 JWT-based authentication
- 🏆 Mission-based CTF system
- 📊 User progress tracking
- 🎯 Skill development system
- 🔒 Rate limiting and security
- 📈 Activity logging
- 🏅 Leaderboard system

## Tech Stack

- **Node.js** with TypeScript
- **Express.js** for API routing
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **express-rate-limit** for rate limiting

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Production:**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Missions
- `GET /api/missions` - Get all missions
- `GET /api/missions/:id` - Get mission details
- `POST /api/missions/:id/submit` - Submit flag
- `POST /api/missions` - Create mission (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/activities` - Get user activities
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)

## Data Models

### User
- Authentication details
- Score and rank tracking
- Completed missions
- Skill progress

### Mission
- CTF challenge details
- Difficulty and points
- Unlock requirements
- Hidden flags

### MissionCompletion
- User completion records
- Attempt tracking
- Performance metrics

### Activity
- User action logging
- Achievement tracking
- System events

### Skill
- Skill definitions
- Progress tracking
- Category organization

## Security Features

- JWT authentication
- Rate limiting
- Input validation
- Helmet security headers
- CORS configuration
- Password hashing with bcrypt
- Protected admin routes

## Development

The backend is structured with:
- **Models** - Mongoose schemas
- **Routes** - Express route handlers
- **Middleware** - Authentication and validation
- **Config** - Database connection
- **Types** - TypeScript interfaces

## Deployment

1. Set production environment variables
2. Build the TypeScript code: `npm run build`
3. Start the server: `npm start`
4. Ensure MongoDB is accessible
5. Configure reverse proxy (nginx/Apache) if needed
