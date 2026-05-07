const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // The SDK doesn't have a direct listModels method on genAI, 
    // it usually requires the 'generative-ai' library from another source or using the REST API.
    // Let's try to just hit a basic model.
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Hi');
    console.log('Success with gemini-pro:', result.response.text());
  } catch (e) {
    console.log('Error with gemini-pro:', e.status, e.statusText);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hi');
    console.log('Success with gemini-1.5-flash:', result.response.text());
  } catch (e) {
    console.log('Error with gemini-1.5-flash:', e.status, e.statusText);
  }
}

listModels();
