import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Email schema
export const emails = pgTable("emails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sender: text("sender").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderAvatar: text("sender_avatar"),
  recipient: text("recipient").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  preview: text("preview").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
  isStarred: boolean("is_starred").notNull().default(false),
  folder: text("folder").notNull().default("inbox"),
  category: text("category").notNull().default("focus"),
  isOnline: boolean("is_online").notNull().default(false),
  hasQuoteOpen: boolean("has_quote_open").notNull().default(false),
  summary: text("summary"),
  trackingToken: text("tracking_token"),
  readAt: timestamp("read_at"),
});

// Snippets table for email templates
export const snippets = pgTable("snippets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  shortcut: text("shortcut").notNull(),
  body: text("body").notNull(),
});

export const insertSnippetSchema = createInsertSchema(snippets).omit({
  id: true,
});

export type InsertSnippet = z.infer<typeof insertSnippetSchema>;
export type Snippet = typeof snippets.$inferSelect;

export const insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  timestamp: true,
});

export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type Email = typeof emails.$inferSelect;

// Internal comments (Whisper)
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emailId: varchar("email_id").notNull(),
  author: text("author").notNull(),
  authorAvatar: text("author_avatar"),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  timestamp: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
