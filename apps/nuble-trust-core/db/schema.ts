import { pgTable, serial, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userAgent: text("user_agent"),
  ipAddresses: jsonb("ip_addresses").$type<string[]>(),
  deviceId: varchar("device", { length: 255 }),
});
