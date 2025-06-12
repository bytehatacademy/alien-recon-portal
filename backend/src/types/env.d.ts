declare namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      PORT: string;
      NODE_ENV: string;
      FRONTEND_URL: string;
      BCRYPT_ROUNDS: string;
      RATE_LIMIT_WINDOW_MS: string;
      RATE_LIMIT_MAX_REQUESTS: string;
      AUTH_RATE_LIMIT_MAX_REQUESTS: string;
    }
  }