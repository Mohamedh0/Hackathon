const { GoogleGenerativeAI } = require('@google/generative-ai');
const textToSpeech = require('@google-cloud/text-to-speech');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const tts = new textToSpeech.TextToSpeechClient();

module.exports = async (req, res) => {
  try {
    const { imageBase64, question } = req.body;

    if (!imageBase64 || !question) {
      return res.status(400).json({ error: 'Image and question are required.' });
    }

    // Step 1: Gemini generates answer about the image
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg', // Adjust if your frontend sends different types
          data: imageBase64.split(',')[1] || imageBase64 // Handle with or without "data:image/..."
        }
      },
      { text: `Answer this question about the image in Arabic: "${question}"` }
    ]);

    const answer = result.response.text();
    if (!answer || answer.trim() === '') {
      return res.status(500).json({ error: 'Gemini did not return an answer.' });
    }

    // Step 2: Convert answer into Arabic speech with Google TTS
    const [ttsResponse] = await tts.synthesizeSpeech({
      input: { text: answer },
      voice: { languageCode: 'ar-XA', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' }
    });

    if (!ttsResponse.audioContent) {
      return res.status(500).json({ error: 'TTS did not return audio content.' });
    }

    res.status(200).json({
      answer,
      audioBase64: `data:audio/mpeg;base64,${ttsResponse.audioContent}`
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
};
