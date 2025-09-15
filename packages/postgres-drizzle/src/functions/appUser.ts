import { db } from '../db';
import { appUsers, users } from '../../../postgres-drizzle/src/schema';
import { eq, and } from 'drizzle-orm';

type NewAppUser = typeof appUsers.$inferInsert;
type AppUser = typeof appUsers.$inferSelect;

export async function createAppUser(data: NewAppUser): Promise<AppUser[]> {
  // Note: This function assumes that the password in `data.passwordHash` is already hashed.
  return db.insert(appUsers).values(data).returning();
}

export async function getAppUserById(id: string): Promise<AppUser | undefined> {
  return db.query.appUsers.findFirst({
    where: eq(appUsers.id, id),
  });
}

export async function updateAppUser(id: string, data: Partial<NewAppUser>): Promise<AppUser[]> {
  return db.update(appUsers).set(data).where(eq(appUsers.id, id)).returning();
}

export async function deleteAppUser(id: string): Promise<AppUser[]> {
  return db.delete(appUsers).where(eq(appUsers.id, id)).returning();
}

export async function getAllAppUsers(appId: string): Promise<AppUser[]> {
  return db.query.appUsers.findMany({
      where: eq(appUsers.appId, appId)
  });
}

/**
 * Get an app user by appId + email (joins users table).
 */
export async function getAppUserByEmail(appId: string, email: string) {
  return db
    .select({
      appUserId: appUsers.id,
      appId: appUsers.appId,
      userId: appUsers.userId,
      email: users.email,
      password : users.passwordHash,
      createdAt: appUsers.createdAt,
    })
    .from(appUsers)
    .innerJoin(users, eq(appUsers.userId, users.id))
    .where(and(eq(appUsers.appId, appId), eq(users.email, email)))
    .then(rows => rows[0]); 
}