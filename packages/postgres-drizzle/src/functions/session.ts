import { db } from '../db';
import { userSessions } from '../../../postgres-drizzle/src/schema';
import { eq } from 'drizzle-orm';

type NewUserSession = typeof userSessions.$inferInsert;
type UserSession = typeof userSessions.$inferSelect;

export async function createUserSession(data: NewUserSession): Promise<UserSession[]> {
  return db.insert(userSessions).values(data).returning();
}

export async function getUserSessionById(id: string): Promise<UserSession | undefined> {
  return db.query.userSessions.findFirst({
    where: eq(userSessions.id, id),
  });
}

export async function updateUserSession(id: string, data: Partial<NewUserSession>): Promise<UserSession[]> {
  return db.update(userSessions).set(data).where(eq(userSessions.id, id)).returning();
}

export async function deleteUserSession(id: string): Promise<UserSession[]> {
  return db.delete(userSessions).where(eq(userSessions.id, id)).returning();
}

export async function getAllUserSessions(userId: string): Promise<UserSession[]> {
  return db.query.userSessions.findMany({
    where: eq(userSessions.userId, userId),
  });
}
