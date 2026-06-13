import mongoose from 'mongoose';
import logger from './logger.js';

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  logger.info('Connected to MongoDB');
};

export default connectDatabase;
