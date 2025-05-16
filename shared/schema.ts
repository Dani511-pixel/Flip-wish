import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  marketingOptIn: boolean("marketing_opt_in").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageCollections = pgTable("message_collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  deadline: timestamp("deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("active"),
  type: text("type").notNull().default("standard"),
  slug: text("slug").notNull().unique(),
  goal: integer("goal"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").notNull(),
  content: text("content").notNull(),
  fromName: text("from_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  hasVoice: boolean("has_voice").default(false),
  voiceUrl: text("voice_url"),
});

export const flipbooks = pgTable("flipbooks", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").notNull(),
  title: text("title").notNull(),
  theme: text("theme").notNull().default("standard"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("active"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  marketingOptIn: true,
});

export const insertMessageCollectionSchema = createInsertSchema(messageCollections).pick({
  userId: true,
  title: true,
  deadline: true,
  type: true,
  goal: true,
  slug: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  collectionId: true,
  content: true,
  fromName: true,
  hasVoice: true,
  voiceUrl: true,
});

export const insertFlipbookSchema = createInsertSchema(flipbooks).pick({
  collectionId: true,
  title: true,
  theme: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MessageCollection = typeof messageCollections.$inferSelect;
export type InsertMessageCollection = z.infer<typeof insertMessageCollectionSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Flipbook = typeof flipbooks.$inferSelect;
export type InsertFlipbook = z.infer<typeof insertFlipbookSchema>;

// Extended schemas for validation
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const createCollectionSchema = insertMessageCollectionSchema
  .omit({ userId: true })
  .extend({
    title: z.string().min(3, "Title must be at least 3 characters"),
    deadline: z.string().or(z.date()),
  });

export const submitMessageSchema = insertMessageSchema
  .omit({ collectionId: true, hasVoice: true, voiceUrl: true })
  .extend({
    content: z.string().min(1, "Message cannot be empty"),
    fromName: z.string().min(1, "Name is required"),
  });
