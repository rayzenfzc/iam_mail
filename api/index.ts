import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import and register routes
import('../server/routes').then(({ registerRoutes }) => {
    const httpServer = createServer(app);
    registerRoutes(httpServer, app);
});

// Export for Vercel
export default app;
