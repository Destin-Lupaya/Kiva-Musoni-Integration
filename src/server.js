// Main application entry point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import apiRoutes from './routes/api.js';
import logger from './services/logger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Database sync and server start
sequelize.sync().then(() => {
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
});