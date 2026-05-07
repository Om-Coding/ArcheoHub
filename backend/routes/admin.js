const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all users and their login activity
// Protected by master password check
router.get('/users', async (req, res) => {
  const adminPassword = req.header('X-Admin-Password');
  
  if (!adminPassword || adminPassword !== process.env.ADMIN_MASTER_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
  }

  try {
    const [users] = await db.query(`
      SELECT id, name, email, role, approved, last_login, created_at 
      FROM users 
      ORDER BY last_login DESC
    `);

    // Fetch recent login history for detail view if needed, or just return users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific user login logs
router.get('/users/:id/logs', async (req, res) => {
  const adminPassword = req.header('X-Admin-Password');
  
  if (!adminPassword || adminPassword !== process.env.ADMIN_MASTER_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [logs] = await db.query(`
      SELECT * FROM login_history 
      WHERE user_id = ? 
      ORDER BY login_time DESC 
      LIMIT 50
    `, [req.params.id]);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
