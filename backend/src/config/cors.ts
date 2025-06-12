import cors from 'cors';

const allowedOrigins = ['http://localhost:8081', 'http://localhost:5173', 'http://127.0.0.1:8081', 'http://127.0.0.1:5173'];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,  // Don't pass OPTIONS to route handlers
  optionsSuccessStatus: 204,  // Some legacy browsers (IE11) choke on 204
  maxAge: 86400, // 24 hours
};

export default corsOptions;
