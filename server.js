require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const imageToSpeechRoute = require('./routes/imageToSpeech');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Single endpoint for image-to-audio
app.post('/api/image-to-arabic-audio', upload.single('image'), imageToSpeechRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
