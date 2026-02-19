
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth Routes (Mock implementation for simplicity given instructions to use dummy data mainly)
  app.post(api.auth.login.path, async (req, res) => {
    // In a real app, verify credentials. Here we just return a success for any non-empty input
    // or a specific test user.
    const { email, password } = req.body;
    if (email && password) {
       // Return a dummy user
       res.json({ id: 1, name: "Test User", email: email });
    } else {
       res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    const { email, name } = req.body;
    res.status(201).json({ id: 1, name, email });
  });

  // Analytics Route (Mock Data)
  app.get(api.analytics.get.path, (_req, res) => {
    res.json({
      totalInterviews: 12,
      averageScore: 78,
      highestScore: 95,
      lowestScore: 60,
      roleWiseScores: [
        { role: "Software Developer", score: 80 },
        { role: "QA", score: 75 },
        { role: "Data Analyst", score: 82 }
      ],
      scoreTrends: [
        { date: "2023-01-01", score: 65 },
        { date: "2023-01-15", score: 70 },
        { date: "2023-02-01", score: 75 },
        { date: "2023-02-15", score: 80 },
        { date: "2023-03-01", score: 85 }
      ],
      questionStats: [
        { name: "Attempted", value: 120 },
        { name: "Feedback Received", value: 120 }
      ]
    });
  });

  // Interview Routes
  app.get(api.interviews.list.path, async (_req, res) => {
     // Return mock history
     res.json([
       { id: 1, userId: 1, role: "Software Developer", level: "Experienced", date: new Date().toISOString(), overallScore: 85, feedbackMode: "constructive" },
       { id: 2, userId: 1, role: "QA", level: "Fresher", date: new Date(Date.now() - 86400000).toISOString(), overallScore: 72, feedbackMode: "friendly" },
       { id: 3, userId: 1, role: "Data Analyst", level: "Experienced", date: new Date(Date.now() - 172800000).toISOString(), overallScore: 90, feedbackMode: "harsh" },
     ]);
  });

  app.get(api.interviews.get.path, async (req, res) => {
    // Return detailed mock interview
    const id = parseInt(req.params.id);
    res.json({
      interview: { id, userId: 1, role: "Software Developer", level: "Experienced", date: new Date().toISOString(), overallScore: 85, feedbackMode: "constructive" },
      questions: [
        { id: 1, interviewId: id, question: "Explain React Hooks", userAnswer: "Hooks allow you to use state...", aiAnalysis: "Good explanation...", feedback: "Mention custom hooks too.", score: 9 },
        { id: 2, interviewId: id, question: "What is closure?", userAnswer: "A closure is...", aiAnalysis: "Correct definition.", feedback: "Provide an example.", score: 8 }
      ]
    });
  });

  app.post(api.interviews.create.path, async (req, res) => {
    // Mock processing and result generation
    const { questions, role, level, feedbackMode } = req.body;
    
    const results = questions.map((q: any) => ({
      question: q.question,
      answer: q.answer,
      analysis: "This is a mock analysis of your answer. It covers key points but could be more specific.",
      feedback: "Try to include more examples in your explanation.",
      score: Math.floor(Math.random() * 30) + 70 // Random score 70-100
    }));

    const overallScore = Math.round(results.reduce((acc: number, curr: any) => acc + curr.score, 0) / results.length);

    res.status(201).json({
      interviewId: Math.floor(Math.random() * 1000),
      overallScore,
      results
    });
  });

  return httpServer;
}
