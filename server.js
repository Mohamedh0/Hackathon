require('dotenv').config();
const express = require('express');
const cors = require('cors');
const imageToSpeechRoute = require('./routes/imageToSpeech');

const app = express();

// ✅ Allow CORS
app.use(cors()); // allow all origins
app.options('*', cors()); // handle preflight for all routes

// ✅ Allow JSON body up to 20MB
app.use(express.json({ limit: '20mb' }));

// ✅ Your route
app.use('/api/image-to-arabic-audio', imageToSpeechRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
