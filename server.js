require('dotenv').config();
const express = require('express');
const cors = require('cors');
const imageToSpeechRoute = require('./routes/imageToSpeech');

const app = express();

// CORS Settings - Allow all origins for API requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware with larger limit for base64 images
app.use(express.json({ limit: '20mb' }));

// API Route
app.use('/api/image-to-arabic-audio', imageToSpeechRoute);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
