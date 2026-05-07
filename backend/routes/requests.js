const express = require('express');
const db = require('../db');
const { authenticate, authorizeArchaeologist } = require('../middleware/auth');
const router = express.Router();

// Request access to classified artifact
router.post('/', authenticate, async (req, res) => {
  try {
    const { artifact_id } = req.body;
    
    if (req.user.role === 'archaeologist') {
      return res.status(400).json({ message: 'Archaeologists already have access' });
    }

    // Check if already requested
    const [existing] = await db.query('SELECT * FROM requests WHERE user_id=? AND artifact_id=?', [req.user.id, artifact_id]);
    if (existing.length > 0) return res.status(400).json({ message: 'Already requested access' });

    await db.query('INSERT INTO requests (user_id, artifact_id) VALUES (?, ?)', [req.user.id, artifact_id]);
    res.status(201).json({ message: 'Access request submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user requests
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, a.name as artifact_name 
      FROM requests r
      JOIN artifacts a ON r.artifact_id = a.id
      WHERE r.user_id = ?
    `, [req.user.id]);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending requests (Archaeologist only)
router.get('/pending', authenticate, authorizeArchaeologist, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, a.name as artifact_name, u.name as user_name, u.email as user_email
      FROM requests r
      JOIN artifacts a ON r.artifact_id = a.id
      JOIN users u ON r.user_id = u.id
      WHERE r.status = 'pending'
    `);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve/Reject request (Archaeologist only)
router.put('/:id/status', authenticate, authorizeArchaeologist, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

    await db.query('UPDATE requests SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: 'Request updated' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
