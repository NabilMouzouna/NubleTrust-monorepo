import { eq, or } from "drizzle-orm";
import { db } from "../db";
import { developers } from "../schema";

type NewDeveloper = typeof developers.$inferInsert;
type Developer = typeof developers.$inferSelect;

/**
 * Create a new developer
 */
export async function createDeveloper(
  data: NewDeveloper
): Promise<Developer | undefined> {
  // Check if developer with same email exists
  const existing = await db.query.developers.findFirst({
    where: eq(developers.email, data.email),
  });

  if (existing) {
    throw new Error(`Developer with email "${data.email}" already exists.`);
  }

  const [dev] = await db.insert(developers).values(data).returning();
  return dev;
}

/**
 * Get developer by ID
 */
export async function getDeveloperById(
  id: string
): Promise<Developer | undefined> {
  return db.query.developers.findFirst({
    where: eq(developers.id, id),
  });
}

/**
 * Get developer by email
 */
export async function getDeveloperByEmail(
  email: string
): Promise<Developer | undefined> {
  return db.query.developers.findFirst({
    where: eq(developers.email, email),
  });
}

/**
 * Update developer
 */
export async function updateDeveloper(
  id: string,
  data: Partial<NewDeveloper>
): Promise<Developer[]> {
  return db
    .update(developers)
    .set(data)
    .where(eq(developers.id, id))
    .returning();
}

/**
 * Delete developer
 */
export async function deleteDeveloper(id: string): Promise<Developer[]> {
  return db.delete(developers).where(eq(developers.id, id)).returning();
}

/**
 * Get all developers
 */
export async function getAllDevelopers(): Promise<Developer[]> {
  return db.query.developers.findMany();
}