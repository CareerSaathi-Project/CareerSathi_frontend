
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(), // Software Developer, QA, Data Analyst
  level: text("level").notNull(), // Fresher, Experienced
  date: timestamp("date").defaultNow(),
  overallScore: integer("overall_score").notNull(),
  feedbackMode: text("feedback_mode").notNull(), // harsh, constructive, friendly
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  interviewId: integer("interview_id").notNull(),
  question: text("question").notNull(),
  userAnswer: text("user_answer").notNull(),
  aiAnalysis: text("ai_analysis").notNull(),
  feedback: text("feedback").notNull(),
  score: integer("score").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertInterviewSchema = createInsertSchema(interviews).omit({ id: true, date: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Interview = typeof interviews.$inferSelect;
export type Question = typeof questions.$inferSelect;
