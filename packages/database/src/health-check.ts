import { db } from './db.js';
import { sql } from 'drizzle-orm';

async function healthCheck() {
  try {
    await db.execute(sql`select 1`);
    console.log('✅ Database connection is healthy.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

healthCheck();
