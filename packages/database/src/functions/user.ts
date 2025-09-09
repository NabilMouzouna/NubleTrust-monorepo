import { db } from '../db.js';
import { appUsers } from '../schema.js';
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

export async function getAppUserByEmail(appId: string, email: string): Promise<AppUser | undefined> {
    return db.query.appUsers.findFirst({
        where: and(eq(appUsers.appId, appId), eq(appUsers.email, email)),
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
