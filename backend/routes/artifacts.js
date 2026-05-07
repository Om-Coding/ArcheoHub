const express = require('express');
const db = require('../db');
const { authenticate, authorizeArchaeologist } = require('../middleware/auth');
const router = express.Router();

// Get all artifacts (public users see public artifacts only, archaeologists see all)
router.get('/', async (req, res) => {
  try {
    const { search, country } = req.query;
    
    // We check authentication conditionally
    const token = req.header('Authorization');
    let role = 'public';
    let userId = null;
    
    if (token) {
      try {
        const decoded = require('jsonwebtoken').verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        role = decoded.role;
        userId = decoded.id;
      } catch(e) {}
    }

    let query = `
      SELECT a.*, c.name as country_name 
      FROM artifacts a
      LEFT JOIN countries c ON a.country_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by classification based on role
    if (role !== 'archaeologist') {
      // Public users see public items OR items they have an approved request for
      query += ` AND (a.classification_level = 'public' 
                 OR a.id IN (SELECT artifact_id FROM requests WHERE user_id = ? AND status = 'approved'))`;
      params.push(userId || 0); // Need to push userId. If null, 0 will not match anything valid
    }

    if (search) {
      query += ` AND (a.name LIKE ? OR c.name LIKE ? OR a.site LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (country) {
      query += ` AND a.country_id = ?`;
      params.push(country);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get artifact by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, c.name as country_name, u.name as created_by_name 
      FROM artifacts a
      LEFT JOIN countries c ON a.country_id = c.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Artifact not found' });
    
    // Add classification logic check here similar to GET / 
    
    res.json(rows[0]);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create artifact (Only archaeologists)
router.post('/', authenticate, authorizeArchaeologist, async (req, res) => {
  try {
    const { name, description, country_id, site, classification_level, image_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO artifacts (name, description, country_id, site, classification_level, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, country_id, site, classification_level || 'public', image_url, req.user.id]
    );
    res.status(201).json({ id: result.insertId, message: 'Artifact created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update artifact (Only archaeologists)
router.put('/:id', authenticate, authorizeArchaeologist, async (req, res) => {
  try {
    const { name, description, country_id, site, classification_level, image_url } = req.body;
    await db.query(
      'UPDATE artifacts SET name=?, description=?, country_id=?, site=?, classification_level=?, image_url=? WHERE id=?',
      [name, description, country_id, site, classification_level, image_url, req.params.id]
    );
    res.json({ message: 'Artifact updated' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete artifact (Only archaeologists)
router.delete('/:id', authenticate, authorizeArchaeologist, async (req, res) => {
  try {
    await db.query('DELETE FROM artifacts WHERE id=?', [req.params.id]);
    res.json({ message: 'Artifact deleted' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
