import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../data/database.sqlite')

// Ensure data directory exists
import fs from 'fs'
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    keyword TEXT NOT NULL,
    language TEXT NOT NULL,
    min_words INTEGER DEFAULT 600,
    max_words INTEGER DEFAULT 800,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    task_id TEXT REFERENCES tasks(id),
    title TEXT NOT NULL,
    content TEXT,
    sections TEXT,
    cover_url TEXT,
    cover_base64 TEXT,
    cover_status TEXT DEFAULT 'pending',
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
  );
`)

// Add cover columns if they don't exist (for existing databases)
try {
  db.exec(`ALTER TABLE articles ADD COLUMN cover_url TEXT`)
} catch (e) { /* column already exists */ }
try {
  db.exec(`ALTER TABLE articles ADD COLUMN cover_base64 TEXT`)
} catch (e) { /* column already exists */ }
try {
  db.exec(`ALTER TABLE articles ADD COLUMN cover_status TEXT DEFAULT 'pending'`)
} catch (e) { /* column already exists */ }

export default db
