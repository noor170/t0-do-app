// src/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://noor:password@localhost:5432/to_do_db',
});

pool.on('connect', () => {
  console.log('[database]: Connected to PostgreSQL successfully');
});

pool.on('error', (err) => {
  console.error('[database]: Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;