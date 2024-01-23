const express = require('express');
const mongoose = require('mongoose'); // Update import statement
const routes = require('./routes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update the MongoDB connection string to use IPv4 address
mongoose.connect('mongodb://127.0.0.1:27017/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
