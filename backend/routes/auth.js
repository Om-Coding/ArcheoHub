const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role validation (ensure only archaeologist or public)
    const assignedRole = role === 'archaeologist' ? 'archaeologist' : 'public';
    const isApproved = assignedRole === 'public' ? 1 : 0;

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, approved) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, assignedRole, isApproved]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = users[0];
    
    // Prevent unapproved users from leveraging the auth token
    if (!user.approved) return res.status(403).json({ error: 'Your account is pending review by an Administrator.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Log Login
    await db.query('INSERT INTO login_history (user_id, ip_address) VALUES (?, ?)', [user.id, req.ip]);
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin approval route for archaeologists
router.put('/approve/:id', async (req, res) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await db.query('UPDATE users SET approved = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'User approved' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/google — verify Google ID token and return JWT
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'No credential provided' });

  try {
    // Verify the token Google gave us
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let user;
    if (existing.length > 0) {
      user = existing[0];
      // Ensure Google users are always approved (public role)
      if (!user.approved) {
        await db.query('UPDATE users SET approved = 1 WHERE id = ?', [user.id]);
        user.approved = 1;
      }
    } else {
      // Auto-register new Google user as public (no password needed)
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role, approved) VALUES (?, ?, ?, ?, ?)',
        [name, email, '', 'public', 1]
      );
      const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUser[0];
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Log Login
    await db.query('INSERT INTO login_history (user_id, ip_address) VALUES (?, ?)', [user.id, req.ip]);
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google credential' });
  }
});

module.exports = router;
