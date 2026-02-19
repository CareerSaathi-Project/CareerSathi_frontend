import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, ChevronRight, Loader2, Award } from "lucide-react";
import { useCreateInterview } from "@/hooks/use-interviews";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Mock Questions for prototype
const MOCK_QUESTIONS = [
  "Explain the difference between useMemo and useCallback in React.",
  "How would you optimize a React application with performance issues?",
  "Describe the Box Model in CSS."
];

export default function Interview() {
  const [step, setStep] = useState<"setup" | "interview" | "processing" | "results">("setup");
  const [role, setRole] = useState("Frontend Developer");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  
  const createInterview = useCreateInterview();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setStep("interview");
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      toast({ title: "Please provide an answer", variant: "destructive" });
      return;
    }
    
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = (finalAnswers: string[]) => {
    setStep("processing");
    
    // Construct payload
    const payload = {
      role,
      level: "Intermediate",
      feedbackMode: "constructive",
      questions: MOCK_QUESTIONS.map((q, i) => ({
        question: q,
        answer: finalAnswers[i]
      }))
    };

    createInterview.mutate(payload, {
      onSuccess: () => {
        setTimeout(() => setStep("results"), 2000); // Fake delay for dramatic effect
      },
      onError: () => {
        toast({ title: "Something went wrong", variant: "destructive" });
        setStep("setup");
      }
    });
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
        
        {/* SETUP STEP */}
        {step === "setup" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-display font-bold">Interview Setup</h1>
              <p className="text-muted-foreground">Configure your mock interview session</p>
            </div>
            
            <Card className="glass-card p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Fullstack Engineer">Fullstack Engineer</SelectItem>
                      <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Junior', 'Mid-Level', 'Senior'].map((level) => (
                      <Button 
                        key={level} 
                        variant="outline" 
                        className="bg-secondary/30 hover:bg-primary/20 hover:text-primary hover:border-primary/50"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleStart} className="w-full h-12 text-lg bg-primary hover:bg-primary/90 mt-4">
                  Start Session <ChevronRight className="ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* INTERVIEW STEP */}
        {step === "interview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}</span>
              <span>{role}</span>
            </div>

            {/* AI Message */}
            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-none border border-white/5 text-lg">
                {MOCK_QUESTIONS[currentQuestionIndex]}
              </div>
            </motion.div>

            {/* User Input */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mt-8"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 space-y-4">
                  <Textarea
                    autoFocus
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[150px] bg-secondary/30 border-white/10 text-lg resize-none focus:ring-primary/50"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleNextQuestion} size="lg" className="bg-primary hover:bg-primary/90">
                      {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'Finish Interview' : 'Next Question'}
                      {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? <Award className="ml-2 w-4 h-4" /> : <Send className="ml-2 w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* PROCESSING STEP */}
        {step === "processing" && (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Bot className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Analyzing your responses...</h2>
              <p className="text-muted-foreground">Our AI is generating detailed feedback for you.</p>
            </div>
          </div>
        )}

        {/* RESULTS STEP */}
        {step === "results" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="inline-block p-4 rounded-full bg-green-500/10 mb-4">
              <Award className="w-12 h-12 text-green-500" />
            </div>
            
            <h1 className="text-4xl font-display font-bold">Interview Complete!</h1>
            <p className="text-xl text-muted-foreground">You scored <span className="text-primary font-bold">85/100</span></p>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              <Card className="bg-card border-green-500/20">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-green-500 mb-2">Strengths</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Clear communication style</li>
                    <li>Strong technical terminology</li>
                    <li>Good structured thinking</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-card border-orange-500/20">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-orange-500 mb-2">Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Elaborate more on trade-offs</li>
                    <li>Provide concrete examples</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" onClick={() => setLocation("/")}>Back to Dashboard</Button>
              <Button onClick={() => setLocation("/history")} className="bg-primary">View Detailed Report</Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
