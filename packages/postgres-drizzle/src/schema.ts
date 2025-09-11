import { pgTable, uuid, varchar, timestamp, text, integer, jsonb, unique } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  apiKey: varchar("api_key", { length: 255 }).notNull(),
  allowedOrigins: text("allowed_origins").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appUsers = pgTable("app_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  appId: uuid("app_id")
    .notNull()
    .references(() => applications.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    uniqueAppUser: unique().on(table.appId, table.userId),
  };
});

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => appUsers.id),
  jwtTokenId: varchar("jwt_token_id", { length: 255 }).notNull().unique(),
  riskScore: integer("risk_score").notNull().default(0),
  deviceFingerprint: text("device_fingerprint").notNull(),
  ipAddress: text("ip_address").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const riskEvents = pgTable("risk_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => userSessions.id),
  eventType: varchar("event_type", { length: 255 }).notNull(),
  riskFactors: jsonb("risk_factors").$type<Record<string, any>>().notNull(),
  calculatedRisk: integer("calculated_risk").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
