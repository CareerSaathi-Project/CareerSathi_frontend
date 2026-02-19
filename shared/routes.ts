
import { z } from "zod";
import { insertUserSchema, insertInterviewSchema, insertQuestionSchema } from "./schema";

export const api = {
  auth: {
    login: {
      method: "POST",
      path: "/api/login",
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: insertUserSchema.omit({ password: true }).extend({ id: z.number() }),
        401: z.object({ message: z.string() }),
      },
    },
    register: {
      method: "POST",
      path: "/api/register",
      input: insertUserSchema,
      responses: {
        201: insertUserSchema.omit({ password: true }).extend({ id: z.number() }),
        400: z.object({ message: z.string() }),
      },
    },
  },
  interviews: {
    list: {
      method: "GET",
      path: "/api/interviews",
      responses: {
        200: z.array(insertInterviewSchema.extend({ id: z.number(), date: z.string() })),
      },
    },
    create: {
      method: "POST",
      path: "/api/interviews",
      input: insertInterviewSchema.omit({ overallScore: true, userId: true }).extend({
        questions: z.array(z.object({
          question: z.string(),
          answer: z.string(),
        })),
      }),
      responses: {
        201: z.object({
          interviewId: z.number(),
          overallScore: z.number(),
          results: z.array(z.object({
            question: z.string(),
            answer: z.string(),
            analysis: z.string(),
            feedback: z.string(),
            score: z.number(),
          })),
        }),
      },
    },
    get: {
      method: "GET",
      path: "/api/interviews/:id",
      responses: {
        200: z.object({
          interview: insertInterviewSchema.extend({ id: z.number(), date: z.string() }),
          questions: z.array(insertQuestionSchema.extend({ id: z.number() })),
        }),
        404: z.object({ message: z.string() }),
      },
    },
  },
  analytics: {
    get: {
      method: "GET",
      path: "/api/analytics",
      responses: {
        200: z.object({
          totalInterviews: z.number(),
          averageScore: z.number(),
          highestScore: z.number(),
          lowestScore: z.number(),
          roleWiseScores: z.array(z.object({ role: z.string(), score: z.number() })),
          scoreTrends: z.array(z.object({ date: z.string(), score: z.number() })),
          questionStats: z.array(z.object({ name: z.string(), value: z.number() })),
        }),
      },
    },
  },
};
