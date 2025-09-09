import { db } from '../db.js';
import { riskEvents } from '../schema.js';
import { eq } from 'drizzle-orm';

type NewRiskEvent = typeof riskEvents.$inferInsert;
type RiskEvent = typeof riskEvents.$inferSelect;

export async function createRiskEvent(data: NewRiskEvent): Promise<RiskEvent[]> {
  return db.insert(riskEvents).values(data).returning();
}

export async function getRiskEventById(id: string): Promise<RiskEvent | undefined> {
  return db.query.riskEvents.findFirst({
    where: eq(riskEvents.id, id),
  });
}

export async function getAllRiskEventsForSession(sessionId: string): Promise<RiskEvent[]> {
  return db.query.riskEvents.findMany({
    where: eq(riskEvents.sessionId, sessionId),
  });
}
