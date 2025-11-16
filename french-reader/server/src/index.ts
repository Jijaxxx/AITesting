import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import textsRoutes from './routes/texts.routes';
import { errorHandler } from './middleware/error';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS: allow comma-separated env origins and common LAN dev origins on Vite ports
const rawCorsOrigins = process.env.CORS_ORIGIN;
const envOrigins = rawCorsOrigins
  ? rawCorsOrigins.split(',').map((s) => s.trim()).filter(Boolean)
  : [];
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];
const allowedOrigins = [...defaultOrigins, ...envOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const inList = allowedOrigins.includes(origin);
      const lanMatch = /^http:\/\/(192\.168|10\.|172\.(1[6-9]|2\d|3[0-1]))\.[0-9]+\.[0-9]+:(517[3-4]|3000)$/.test(origin);
      const loopbackMatch = /^http:\/\/(localhost|127\.0\.0\.1):(517[3-4]|3000)$/.test(origin);

      if (inList || lanMatch || loopbackMatch) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/texts', textsRoutes);

// Error handling
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '4000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local:   http://localhost:${PORT}/api`);
  console.log(`Network: http://192.168.1.24:${PORT}/api`);
});