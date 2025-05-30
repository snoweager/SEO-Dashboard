// backend/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const Database = require('better-sqlite3');

const app = express();
const PORT = 5000;
const API_KEY = process.env.PSI_API_KEY;

// Debug: check if API key is loaded
console.log("✅ Loaded PSI_API_KEY:", API_KEY);

app.use(cors());
app.use(express.json());

// SQLite setup
const db = new Database('./seo_results.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS results (
    url TEXT PRIMARY KEY,
    data TEXT,
    createdAt INTEGER
  )
`).run();

app.get('/', (req, res) => {
  res.send('SEO Analyzer backend is running.');
});

app.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    const row = db.prepare('SELECT data, createdAt FROM results WHERE url = ?').get(url);

    if (row && now - row.createdAt < oneHour) {
      console.log('🟡 Serving from cache...');
      return res.json(JSON.parse(row.data));
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}`;
    const response = await axios.get(apiUrl);
    const resultData = response.data;

    db.prepare('INSERT OR REPLACE INTO results (url, data, createdAt) VALUES (?, ?, ?)').run(
      url,
      JSON.stringify(resultData),
      now
    );

    res.json(resultData);
  } catch (error) {
    if (error.response) {
      console.error("🔴 API Error:", error.response.status, error.response.data);
    } else {
      console.error("🔴 Unknown Error:", error.message);
    }
    res.status(500).json({ error: "Failed to analyze the URL." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://192.168.29.56:${PORT}`);
});
