import { db } from './db';
import { sql } from 'drizzle-orm';
import { getApplicationByApiKey } from './functions/app';
import { createDeveloper } from './functions/developer';

// async function healthCheck() {
//   try {
//     await db.execute(sql`select 1`);
//     console.log('✅ Database connection is healthy.');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Database connection failed:', error);
//     process.exit(1);
//   }
// }

// async function healthCheck(){
//   try {
//     const app = await getApplicationByApiKey("0cf1ec8aabfcc4f4a8c2dc84750b4723556f7a04bea58aef40141b199d33c538")
//     console.log('✅ found',app);
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Not found', error);
//     process.exit(1);
//   }
// }
// healthCheck();

async function firstDev(){
  try {
    const dev = await createDeveloper({email : "nabilmouzouna@gmail.com",passwordHash : "Nab@123"})
    console.log(dev)
  } catch (error) {
    console.log((error as Error).message)
  }
}

firstDev()