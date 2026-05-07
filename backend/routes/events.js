const express = require('express');
const db = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY date DESC');
    
    if (rows.length < 5) {
      const needed = 5 - rows.length;
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate exactly ${needed} distinct, factual, and strictly true upcoming or recently announced real-world archaeology events (e.g. real international conferences, museum exhibitions, or significant virtual tours). Do NOT hallucinate or invent fake events. Ensure the events actually exist in the real world. Return the result strictly as a JSON array of objects with 'title' and 'content' keys. Do not include markdown code block formatting like \`\`\`json.`;
      
      const result = await model.generateContent(prompt);
      const responseText = (await result.response.text()).replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const generatedEvents = JSON.parse(responseText);
        for (const item of generatedEvents) {
          await db.query('INSERT INTO events (title, content) VALUES (?, ?)', [item.title, item.content]);
        }
        // Re-fetch after insert
        const [updatedRows] = await db.query('SELECT * FROM events ORDER BY date DESC');
        return res.json(updatedRows);
      } catch (parseError) {
        console.error('Failed to parse Gemini JSON:', parseError, responseText);
        return res.json(rows);
      }
    }
    
    res.json(rows);
  } catch(err) {
    console.error('Events Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    await db.query('INSERT INTO events (title, content) VALUES (?, ?)', [title, content]);
    res.status(201).json({ message: 'Event posted' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
