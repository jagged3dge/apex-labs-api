// src/db/index.ts
import { Database } from 'sqlite';
import { setupDatabase } from './setup';

let db: Database | null = null;

/**
 * Returns a singleton instance of the database connection.
 * Creates a new connection if one doesn't exist.
 */
export async function getDatabase(): Promise<Database> {
  if (!db) {
    db = await setupDatabase();
  }
  return db;
}

/**
 * Closes the database connection.
 * Useful for testing and cleanup.
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

/**
 * Resets the database connection.
 * Useful for testing.
 */
export async function resetDatabase(): Promise<void> {
  await closeDatabase();
  db = await setupDatabase();
}

export default {
  getDatabase,
  closeDatabase,
  resetDatabase,
};
