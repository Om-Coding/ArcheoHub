const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/:countryId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sites WHERE country_id = ?', [req.params.countryId]);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
