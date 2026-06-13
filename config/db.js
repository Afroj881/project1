const mongoose = require('mongoose');

const connectDatabase = async (mongoUri) => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to MongoDB');
};

module.exports = connectDatabase;
