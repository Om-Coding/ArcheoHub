const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const artifactRoutes = require('./routes/artifacts');
const countryRoutes = require('./routes/countries');
const siteRoutes = require('./routes/sites');
const questionRoutes = require('./routes/questions');
const requestRoutes = require('./routes/requests');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artifacts', artifactRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
