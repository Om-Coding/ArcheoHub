const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// POST /api/ai/summary
router.post('/summary', async (req, res) => {
  try {
    const { name, description, site, country } = req.body;
    
    const prompt = `Act as an expert archaeologist running a kids' learning program. 
Summarize the following artifact using simple, engaging language (max 3 sentences) suitable for learning.
Artifact Name: ${name}
Found: ${site}, ${country}
Description: ${description}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('Gemini Generate Content Error:', error);
    res.status(500).json({ error: 'Failed to generate AI summary' });
  }
});

// POST /api/ai/ask
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    const prompt = `Act as a verified, highly knowledgeable archaeologist answering a question from a curious public member.
Keep your answer educational, friendly, and factual. Do not exceed 4 sentences.
Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ answer: response.text() });
  } catch (error) {
    console.error('Gemini Q&A Error:', error);
    res.status(500).json({ error: 'Failed to answer' });
  }
});

// POST /api/ai/qa-overview - Summarize all recent questions
router.post('/qa-overview', async (req, res) => {
  try {
    const { questions } = req.body;
    if (!questions || questions.length === 0) {
      return res.json({ overview: "No questions to summarize yet. Why not ask one?" });
    }

    const questionsList = questions.map(q => q.question).join('\n- ');
    const prompt = `Act as a chief archaeologist. Provide a brief, professional overview/summary of the following questions being asked by the community. 
Identify the main themes and current interests. Max 4 sentences.
Questions:
- ${questionsList}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ overview: response.text() });
  } catch (error) {
    console.error('Gemini QA Overview Error:', error);
    res.status(500).json({ error: 'Failed to generate overview' });
  }
});

module.exports = router;
