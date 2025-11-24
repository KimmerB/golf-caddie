import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const isTest = process.env.NODE_ENV === 'test';
const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = isTest ? ':memory:' : path.join(dataDir, 'golf-mvp.db');

if (!isTest) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    claimed_distance INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    course_name TEXT,
    course_rating REAL,
    slope INTEGER,
    differential REAL
  );

  CREATE TABLE IF NOT EXISTS holes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    round_id INTEGER NOT NULL,
    hole_number INTEGER NOT NULL,
    strokes INTEGER,
    putts INTEGER,
    fir INTEGER,
    gir INTEGER,
    in_play INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(round_id, hole_number),
    FOREIGN KEY (round_id) REFERENCES rounds(id) ON DELETE CASCADE
  );
`);
