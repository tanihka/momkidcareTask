const fetchAndLogLatestEmail = require('./email'); 
const express = require('express');
const mongoose = require('mongoose');
const app = express();


const MONGODB_URI = 'mongodb+srv://taanishkag078:123456781@cluster0.a4fwwn8.mongodb.net/?retryWrites=true&w=majority';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


fetchAndLogLatestEmail();
