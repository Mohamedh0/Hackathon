const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  try {
    const { base64Image, mimeType } = req.body;

    if (!base64Image || !mimeType) {
      return res.status(400).json({ error: 'base64Image and mimeType are required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const geminiResult = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      { text: 'Describe this image in Arabic in one short paragraph.' }
    ]);

    const arabicText = geminiResult.response.text();

    if (!arabicText || arabicText.trim() === '') {
      return res.status(500).json({ error: 'Gemini did not return any description.' });
    }

    const elevenResponse = await axios({
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream',
      headers: {
        'xi-api-key': process.env.ELEVEN_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      responseType: 'arraybuffer',
      data: {
        text: arabicText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }
    });

    const audioBase64 = Buffer.from(elevenResponse.data).toString('base64');

    res.status(200).json({
      message: 'Success',
      description: arabicText,
      audioBase64: audioBase64
    });

  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Internal Server Error' });
  }
};
