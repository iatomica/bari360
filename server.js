import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files directory
const distPath = path.join(__dirname, 'dist');
const dataDir = path.join(__dirname, 'data');
const jsonFilePath = path.join(dataDir, 'entries.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// PostgreSQL Connection
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgres://bari360_user:Bari360SecurePassword2026%21@m8404cck84ow8g0808cc4go8:5432/bari360_db';
let pool = null;

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: false
    });
    console.log('Connected to PostgreSQL pool');
  } catch (err) {
    console.warn('PostgreSQL initialization skipped:', err.message);
  }
}

async function initDB() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('PostgreSQL table "entries" ready');
  } catch (err) {
    console.warn('Could not init PostgreSQL table:', err.message);
  }
}
initDB();

// Helper to get fallback entries file
function readJsonEntries() {
  if (fs.existsSync(jsonFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    } catch (e) {
      console.error('Error reading JSON entries file:', e);
    }
  }
  return null;
}

function writeJsonEntries(entries) {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(entries, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing JSON entries file:', e);
  }
}

// API Routes
app.get('/api/entries', async (req, res) => {
  if (pool) {
    try {
      const result = await pool.query('SELECT data FROM entries ORDER BY id ASC');
      if (result.rows.length > 0) {
        return res.json(result.rows.map(row => row.data));
      }
    } catch (err) {
      console.warn('DB query failed, falling back to JSON storage:', err.message);
    }
  }

  const jsonEntries = readJsonEntries();
  if (jsonEntries) {
    return res.json(jsonEntries);
  }

  return res.json([]);
});

app.post('/api/entries', async (req, res) => {
  const entry = req.body;
  if (!entry || !entry.id) {
    return res.status(400).json({ error: 'Entry ID required' });
  }

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO entries (id, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [entry.id, JSON.stringify(entry)]
      );
    } catch (err) {
      console.warn('DB insert failed, writing fallback JSON:', err.message);
    }
  }

  // Also update local JSON storage
  let current = readJsonEntries() || [];
  const idx = current.findIndex(e => e.id === entry.id);
  if (idx >= 0) {
    current[idx] = entry;
  } else {
    current.push(entry);
  }
  writeJsonEntries(current);

  return res.json({ success: true, entry });
});

app.post('/api/entries/bulk', async (req, res) => {
  const entries = req.body;
  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: 'Array required' });
  }

  if (pool) {
    try {
      for (const entry of entries) {
        if (entry && entry.id) {
          await pool.query(
            `INSERT INTO entries (id, data, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
            [entry.id, JSON.stringify(entry)]
          );
        }
      }
    } catch (err) {
      console.warn('DB bulk insert failed:', err.message);
    }
  }

  writeJsonEntries(entries);
  return res.json({ success: true, count: entries.length });
});

app.delete('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  if (pool) {
    try {
      await pool.query('DELETE FROM entries WHERE id = $1', [id]);
    } catch (err) {
      console.warn('DB delete failed:', err.message);
    }
  }

  let current = readJsonEntries() || [];
  current = current.filter(e => e.id !== id);
  writeJsonEntries(current);

  return res.json({ success: true, id });
});

// Serve static frontend
app.use(express.static(distPath));
app.use('/360', express.static(path.join(__dirname, 'public', '360')));

// Serve SPA index.html for all non-API routes (Express 4 & 5 compatible)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Bari360 production server listening on port ${PORT}`);
});
