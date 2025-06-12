# Alien Recon Lab - Backend API

A secure MongoDB-based backend for the Alien Recon Lab CTF platform, featuring an alien-themed rank progression system.

## Features

- 🔐 JWT-based authentication with secure session management
- 🏆 Progressive mission-based CTF system with unlock requirements
- 👽 Alien-themed rank progression system with 6 tiers
- 📊 Real-time user progress and scoring tracking
- 🎯 Skill development system across multiple cybersecurity domains
- 🔒 Comprehensive security with rate limiting and input validation
- 📈 Detailed activity and achievement logging
- 🏅 Dynamic leaderboard system with pagination

## Tech Stack

- **Node.js** with TypeScript - Type-safe server implementation
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** with Mongoose ODM - Flexible document database
- **JWT** - Secure, stateless authentication
- **bcryptjs** - Secure password hashing
- **Helmet** - Security header management
- **express-rate-limit** - API request throttling
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment configuration

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── cors.ts     # CORS settings
│   │   └── db.ts       # Database connection
│   ├── middleware/     # Express middleware
│   │   └── auth.ts     # JWT authentication
│   ├── models/         # Mongoose models
│   │   ├── Activity.ts
│   │   ├── Mission.ts
│   │   ├── User.ts
│   │   └── ...
│   ├── routes/         # API endpoints
│   │   ├── auth.ts
│   │   ├── missions.ts
│   │   └── users.ts
│   ├── scripts/        # Utility scripts
│   │   ├── seedMissions.ts
│   │   └── migrateRanks.ts
│   └── server.ts       # Main application file
├── package.json
└── tsconfig.json
```

## Setup

1. **Install dependencies:**
   ```powershell
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```powershell
   # Copy example env file
   Copy-Item .env.example .env
   
   # Configure environment variables
   # MONGODB_URI=mongodb://localhost:27017/alien-recon-lab
   # JWT_SECRET=your-secret-key
   # PORT=5000
   # NODE_ENV=development
   ```

3. **Development:**
   ```powershell
   # Start MongoDB (ensure it's installed)
   mongod
   
   # Run development server
   npm run dev
   ```

4. **Database Seeding:**
   ```powershell
   # Seed initial missions
   npm run seed:missions
   ```

5. **Production:**
   ```powershell
   npm run build
   npm start
   ```

## Environment Variables

### Required Variables
- `MONGODB_URI` - MongoDB connection string
  - Format: `mongodb://localhost:27017/alien-recon-lab`
- `JWT_SECRET` - Secret key for JWT token generation
  - Must be at least 32 characters long
- `NODE_ENV` - Environment setting
  - Values: `development` or `production`

### Optional Variables with Defaults
- `PORT` - Server port (default: 5000)
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `RATE_LIMIT_WINDOW` - Rate limiting window in minutes (default: 15)
- `RATE_LIMIT_MAX` - Maximum requests per window (default: 100)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `LOG_LEVEL` - Logging verbosity (default: info)

## Rank System

The platform features a unique alien-themed rank progression system:

1. 🔰 **Recon Trainee** - Starting rank
2. 📚 **Cipher Cadet** - Unlocked after 5 missions
3. 🌟 **Gamma Node** - Unlocked after 10 missions
4. 🌌 **Sigma-51** - Unlocked after 15 missions
5. 👑 **Command Entity** - Unlocked after 20 missions
6. 🛸 **Delta Agent** - Elite rank, unlocked after 25 missions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login with JWT token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile and avatar

### Missions
- `GET /api/missions` - Get all available missions
- `GET /api/missions/:id` - Get detailed mission information
- `POST /api/missions/:id/submit` - Submit flag attempt
- `POST /api/missions` - Create new mission (Admin)
- `PUT /api/missions/:id` - Update mission details (Admin)
- `DELETE /api/missions/:id` - Deactivate mission (Admin)

### Users
- `GET /api/users/profile` - Get detailed user profile
- `GET /api/users/leaderboard` - Get paginated leaderboard
- `GET /api/users/activities` - Get user activity log
- `GET /api/users` - List all users (Admin)
- `GET /api/users/:id` - Get user details (Admin)
- `PUT /api/users/:id` - Update user status (Admin)

## Data Models

### User
- Authentication details (email, hashed password)
- Profile information (name, avatar)
- Score tracking and dynamic rank calculation
- Completed missions tracking
- Skill progress across domains
- Activity and login history
- User status and permissions

### Mission
- Challenge details and story elements
- Difficulty levels (Beginner to Expert)
- Points system (1-1000 points)
- Progressive unlock requirements
- Secure flag storage
- Mission order and dependencies
- Time estimates and resources
- Active/Inactive status

### MissionCompletion
- Detailed submission records
- Attempt history tracking
- Points earned calculation
- Completion timestamps
- Performance analytics
- User agent and IP logging

### Activity
- Comprehensive action logging
- Achievement tracking
- Rank promotion events
- System notifications
- Performance metrics
- Metadata storage
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

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for public APIs
- Follow the established project structure

### Security Best Practices

1. **Authentication & Authorization**
   - JWT tokens are required for protected routes
   - Implement role-based access control
   - Validate user permissions for each action

2. **Data Validation**
   - Validate all input data
   - Sanitize user input
   - Use TypeScript types and interfaces

3. **Error Handling**
   - Never expose internal errors to clients
   - Log errors properly
   - Return appropriate HTTP status codes

4. **Rate Limiting**
   - API endpoints are rate-limited
   - Prevents brute force attacks
   - Customizable limits per route

5. **Mission Security**
   - Flags are stored securely
   - Submissions are logged and monitored
   - Anti-cheating measures implemented

## Contributing

1. Fork the repository
2. Create your feature branch
3. Follow the code style guidelines
4. Write meaningful commit messages
5. Submit a pull request

## License

MIT License - See LICENSE file for details
