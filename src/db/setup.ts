import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export async function setupDatabase(): Promise<Database> {
  const db = await open({
    filename: path.join(__dirname, 'lab_results.db'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      ref_range_low REAL NOT NULL,
      ref_range_high REAL NOT NULL,
      ref_range_critical_low REAL,
      ref_range_critical_high REAL,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );

    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL,
      value REAL NOT NULL,
      status TEXT CHECK(status IN ('normal', 'high', 'low', 'critical')) NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (test_id) REFERENCES tests (id)
    );
  `);

  return db;
}
