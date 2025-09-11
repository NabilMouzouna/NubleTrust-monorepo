import { db } from '../db';
import { users } from '../../../postgres-drizzle/src/schema';
import { eq } from 'drizzle-orm';

type NewUser = typeof users.$inferInsert;
type User = typeof users.$inferSelect;

export async function createUser(data: NewUser): Promise<User[]> {
  return db.insert(users).values(data).returning();
}

export async function getUserById(id: string): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function updateUser(id: string, data: Partial<NewUser>): Promise<User[]> {
  return db.update(users).set(data).where(eq(users.id, id)).returning();
}

export async function deleteUser(id: string): Promise<User[]> {
  return db.delete(users).where(eq(users.id, id)).returning();
}

export async function getAllUsers(): Promise<User[]> {
  return db.query.users.findMany();
}
