import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import profileRoutes from './routes/profiles.js';
import progressRoutes from './routes/progress.js';
import rewardRoutes from './routes/rewards.js';
import syncRoutes from './routes/sync.js';
import exportRoutes from './routes/export.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// Behind Nginx/proxy in production: trust proxy for correct IPs/X-Forwarded-For
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware de sécurité
app.use(helmet());

// CORS configuration
if (NODE_ENV === 'production') {
  // In production, reflect request origin (serving frontend + API on same host)
  app.use(cors({ origin: true, credentials: true }));
} else {
  // In development, allow localhost/LAN Vite servers + any provided env origins
  const rawCorsOrigins = process.env.CORS_ORIGIN;
  const envOrigins = rawCorsOrigins
    ? rawCorsOrigins.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
  ];
  const allowedOrigins = [...defaultOrigins, ...envOrigins];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow non-browser requests (no Origin header)
        if (!origin) return callback(null, true);

        // Allow explicit list from env/defaults
        const inList = allowedOrigins.includes(origin);

        // Allow common LAN patterns for Vite dev server (5173/5174)
        const lanMatch = /^http:\/\/(192\.168|10\.|172\.(1[6-9]|2\d|3[0-1]))\.[0-9]+\.[0-9]+:517[3-4]$/.test(origin);
        const loopbackMatch = /^http:\/\/(localhost|127\.0\.0\.1):517[3-4]$/.test(origin);

        if (inList || lanMatch || loopbackMatch) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
      credentials: true,
    })
  );
}

// Rate limiting (100 requêtes par 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Parsing JSON
app.use(express.json({ limit: '10mb' }));

// Logging (Morgan en dev)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/profiles', profileRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`📍 Local: http://localhost:${PORT}/api`);
  console.log(`📍 Network: http://192.168.1.24:${PORT}/api`);
});
