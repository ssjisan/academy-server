const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes.js')
const enrollmentRoutes = require('./routes/enrollmentRoutes.js')
const cors = require('cors')
dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// connect database //
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));


// Basic Route
app.get('/', (req, res) => {
  res.send('🚀 Server is up and running!');
});


app.use(studentRoutes);
app.use(enrollmentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🔊 Server running on http://localhost:${PORT}`);
});
