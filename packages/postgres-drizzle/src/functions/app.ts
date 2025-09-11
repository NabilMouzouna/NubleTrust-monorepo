import { eq, or } from 'drizzle-orm';
import {db} from "../db"
import { applications } from '../schema';

type NewApplication = typeof applications.$inferInsert;
type Application = typeof applications.$inferSelect;

export async function createApplication(data: NewApplication): Promise<Application|undefined> {
  // Check if app with same name or apiKey already exists
  const existingApp = await db.query.applications.findFirst({
    where: or(eq(applications.name, data.name), eq(applications.apiKey, data.apiKey)),
  });

  if (existingApp) {
    throw new Error(`Application with name "${data.name}" or API key already exists.`);
  }
  // Insert new app
  const [app] = await db.insert(applications).values(data).returning();
  return app;
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  return db.query.applications.findFirst({
    where: eq(applications.id, id),
  });
}

export async function getApplicationByApiKey(apiKey: string): Promise<Application | undefined> {
  return db.query.applications.findFirst({
    where: eq(applications.apiKey, apiKey),
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