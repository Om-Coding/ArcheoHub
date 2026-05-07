const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM countries ORDER BY name ASC');
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
