import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Loader2, Award } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth";

const BASE_URL = "https://careersathi-rm5f.onrender.com";

type QA = {
  question: string;
  answer: string;
};

type Feedback = {
  verbal_feedback?: string;
  verdict?: string;
};

type Response = {
  question?: string;
  answer?: string;
  feedback?: Feedback;
};

type Result = {
  score?: { overall_score?: number; summary?: string };
  role?: string;
  level?: string;
  responses?: Response[];
};

export default function Interview() {
  const { token } = useAuthStore();

  const [role, setRole] = useState("Software Developer");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [feedbackMode, setFeedbackMode] = useState("harsh");

  const [step, setStep] = useState<"setup" | "interview" | "loading" | "result">("setup");

  const [history, setHistory] = useState<QA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");

  // ===============================
  // Fetch Next Question (AI)
  // ===============================
  const fetchNextQuestion = async (updatedHistory: QA[]) => {
    setLoadingQuestion(true);
    try {
      const res = await fetch(`${BASE_URL}/interview/next-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role,
          experience_level: experienceLevel,
          history: updatedHistory,
        }),
      });

      const data = await res.json();
        if (!data?.question) {
          console.error("❌ Invalid question response:", data);

          setCurrentQuestion("⚠️ Failed to generate question. Click next to retry.");
          setLoadingQuestion(false);
          return;
        }

        setCurrentQuestion(data.question);
        console.log("API response:", data);
      setCurrentAnswer("");
    } catch (error) {
      console.error("Error fetching next question:", error);
      setCurrentQuestion("Failed to load question. Please try again.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  // ===============================
  // Start Interview
  // ===============================
  const startInterview = async () => {
    setStep("interview");
    setHistory([]);
    await fetchNextQuestion([]);
  };

  // ===============================
  // Next Question
  // ===============================
  const handleNext = async () => {
    if (!currentAnswer.trim()) return;

    const updatedHistory = [...history, { question: currentQuestion, answer: currentAnswer }];
    setHistory(updatedHistory);

    if (updatedHistory.length >= Number(numberOfQuestions)) {
      submitInterview(updatedHistory);
      return;
    }

    await fetchNextQuestion(updatedHistory);
  };

  // ===============================
  // Submit Interview
  // ===============================
  const submitInterview = async (finalHistory: QA[]) => {
    setStep("loading");

    const payload = {
      responses: finalHistory.map((item) => ({
        question: item.question,
        answer: item.answer,
        role,
        experience_level: experienceLevel,
        feedback_mode: feedbackMode,
      })),
    };

    try {
      const res = await fetch(`${BASE_URL}/interview/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data ?? null);
      setStep("result");
    } catch (error) {
      console.error("Error submitting interview:", error);
      setResult(null);
      setStep("result");
    }
  };

  return (
    <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
      {/* ================= SETUP ================= */}
      {step === "setup" && (
        <Card className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-center">Start AI Interview</h1>

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>

              {/* TECH */}
              <SelectItem value="Software Developer">Software Developer</SelectItem>
              <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
              <SelectItem value="Backend Developer">Backend Developer</SelectItem>
              <SelectItem value="AI Engineer">AI Engineer</SelectItem>
              <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>

              {/* ENGINEERING */}
              <SelectItem value="Mechanical Engineer">Mechanical Engineer</SelectItem>
              <SelectItem value="Civil Engineer">Civil Engineer</SelectItem>
              <SelectItem value="Electrical Engineer">Electrical Engineer</SelectItem>

              {/* BUSINESS */}
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>

              {/* SCIENCE */}
              <SelectItem value="Data Scientist">Data Scientist</SelectItem>
              <SelectItem value="Research Scientist">Research Scientist</SelectItem>
            </SelectContent>
          </Select>

          <Select value={experienceLevel} onValueChange={setExperienceLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fresher">Fresher</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>

          <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
            <SelectTrigger>
              <SelectValue placeholder="Number of Questions" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1">1 Question</SelectItem>
              <SelectItem value="3">3 Questions</SelectItem>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
              <SelectItem value="15">15 Questions</SelectItem>
            </SelectContent>
          </Select>

          <Select value={feedbackMode} onValueChange={setFeedbackMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="harsh">Harsh</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="encouraging">Encouraging</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={startInterview}>Begin Interview</Button>
        </Card>
      )}

      {/* ================= INTERVIEW ================= */}
      {step === "interview" && (
        <motion.div key={currentQuestion} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Question {history.length + 1} / {numberOfQuestions}</h2>

            {loadingQuestion ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-lg">{currentQuestion}</p>

                <Textarea
                  placeholder="Type your answer..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                />

                <Button onClick={handleNext}>
                  {history.length + 1 >= Number(numberOfQuestions)
                                      ? "Finish Interview"
                                      : "Next Question"}
                </Button>
              </>
            )}
          </Card>
        </motion.div>
      )}

      {/* ================= LOADING ================= */}
      {step === "loading" && (
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin mx-auto" size={40} />
          <p>Evaluating your performance...</p>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {step === "result" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="text-center">
            <Award size={50} className="mx-auto text-green-500" />
            <h2 className="text-3xl font-bold">
              Overall Score: {result?.score?.overall_score ?? "N/A"}
            </h2>
            <p>
              {result?.role ?? "Role Unknown"} – {result?.level ?? "Level Unknown"}
            </p>
            <p className="text-muted-foreground">{result?.score?.summary ?? ""}</p>
          </div>

          {(result?.responses ?? []).map((r, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-3">
                <p className="font-semibold">Q: {r.question ?? "N/A"}</p>
                <p className="text-muted-foreground">Your Answer: {r.answer ?? "N/A"}</p>

                <div className="text-sm">
                  <p className="font-semibold">Feedback:</p>
                  <p>{r.feedback?.verbal_feedback ?? "No feedback available"}</p>
                  <p className="mt-2 font-semibold">Verdict: {r.feedback?.verdict ?? "Pending"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}