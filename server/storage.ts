
import { db } from "./db";
import { users, interviews, questions, type User, type InsertUser, type Interview, type Question, type InsertInterview, type InsertQuestion } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createInterview(interview: InsertInterview): Promise<Interview>;
  getInterviews(userId: number): Promise<Interview[]>;
  getInterview(id: number): Promise<Interview | undefined>;
  
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestions(interviewId: number): Promise<Question[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createInterview(insertInterview: InsertInterview): Promise<Interview> {
    const [interview] = await db.insert(interviews).values(insertInterview).returning();
    return interview;
  }

  async getInterviews(userId: number): Promise<Interview[]> {
    return await db.select().from(interviews).where(eq(interviews.userId, userId));
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }

  async getQuestions(interviewId: number): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.interviewId, interviewId));
  }
}

export const storage = new DatabaseStorage();
