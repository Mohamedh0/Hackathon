require('dotenv').config();
const express = require('express');
const path = require('path');
const imageToSpeechRoute = require('./routes/imageToSpeech');

const app = express();
app.use(express.json({ limit: '20mb' })); // Increase limit for large base64

// Use image-to-speech route
app.post('/api/image-to-arabic-audio', imageToSpeechRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
