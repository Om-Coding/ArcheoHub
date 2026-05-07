const express = require('express');
const db = require('../db');
const { authenticate, authorizeArchaeologist } = require('../middleware/auth');
const router = express.Router();

// Get all Q&A
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT q.*, u.name as asked_by 
      FROM questions q
      JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Ask a question (Authenticated users)
router.post('/', authenticate, async (req, res) => {
  try {
    const { question } = req.body;
    await db.query('INSERT INTO questions (user_id, question) VALUES (?, ?)', [req.user.id, question]);
    res.status(201).json({ message: 'Question submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Answer a question (Only archaeologists)
router.put('/:id/answer', authenticate, authorizeArchaeologist, async (req, res) => {
  try {
    const { answer } = req.body;
    await db.query('UPDATE questions SET answer=? WHERE id=?', [answer, req.params.id]);
    res.json({ message: 'Answer submitted' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
