import { db } from '../db.js';
import { applications } from '../schema.js';
import { eq } from 'drizzle-orm';

type NewApplication = typeof applications.$inferInsert;
type Application = typeof applications.$inferSelect;

export async function createApplication(data: NewApplication): Promise<Application[]> {
  return db.insert(applications).values(data).returning();
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  return db.query.applications.findFirst({
    where: eq(applications.id, id),
  });
}

export async function updateApplication(id: string, data: Partial<NewApplication>): Promise<Application[]> {
  return db.update(applications).set(data).where(eq(applications.id, id)).returning();
}

export async function deleteApplication(id: string): Promise<Application[]> {
  return db.delete(applications).where(eq(applications.id, id)).returning();
}

export async function getAllApplications(): Promise<Application[]> {
  return db.query.applications.findMany();
}
