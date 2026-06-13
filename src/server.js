import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import connectDatabase from './config/db.js';
import teamRoutes from './routes/teamRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import activityLogger from './middleware/activityLogger.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(activityLogger);

app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);

app.get('/', (req, res) => res.json({ message: 'Team Management API is running' }));
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
