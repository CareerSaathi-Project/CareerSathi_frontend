import { useMemo } from "react";
import { useAuthStore } from "@/hooks/use-auth";
import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Trophy,
  Target,
  Brain,
  BarChart3,
} from "lucide-react";
import { useInterviews } from "@/hooks/use-interviews";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data } = useInterviews();

  const interviews = Array.isArray(data)
    ? data
    : data?.interviews || [];

  // =========================================
  // REAL CALCULATED STATS
  // =========================================

  const analytics = useMemo(() => {
    const totalInterviews = interviews.length;

    let totalScore = 0;
    let validScores = 0;
    let highestScore = 0;

    const roleCount: Record<string, number> = {};

    interviews.forEach((interview: any) => {
      const score = interview?.score?.overall_score || 0;

      if (score > 0) {
        totalScore += score;
        validScores++;
      }

      if (score > highestScore) {
        highestScore = score;
      }

      const role = interview?.role || "Unknown";

      roleCount[role] = (roleCount[role] || 0) + 1;
    });

    const averageScore =
      validScores > 0
        ? (totalScore / validScores).toFixed(1)
        : "0";

    const strongestRole =
      Object.entries(roleCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    const totalQuestions = interviews.reduce(
      (acc: number, interview: any) =>
        acc + (interview?.responses?.length || 0),
      0
    );

    const estimatedPracticeHours = (
      totalQuestions * 2.5 / 60
    ).toFixed(1);

    return {
      totalInterviews,
      averageScore,
      highestScore,
      strongestRole,
      totalQuestions,
      estimatedPracticeHours,
    };
  }, [interviews]);

  // =========================================
  // DYNAMIC STATS
  // =========================================

  const stats = [
    {
      label: "Total Interviews",
      value: analytics.totalInterviews,
      icon: Target,
      color: "text-blue-500",
    },
    {
      label: "Average Score",
      value: `${analytics.averageScore}/10`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Practice Time",
      value: `${analytics.estimatedPracticeHours}h`,
      icon: Clock,
      color: "text-orange-500",
    },
    {
      label: "Best Score",
      value: analytics.highestScore || 0,
      icon: Trophy,
      color: "text-yellow-500",
    },
  ];

  // =========================================
  // RECENT INTERVIEWS
  // =========================================

  const recentInterviews = [...interviews]
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  // =========================================
  // AI INSIGHTS
  // =========================================

  const aiInsight =
    Number(analytics.averageScore) >= 8
      ? "Your communication and interview structure are consistently strong. Focus on refining advanced scenario-based answers to reach top-tier performance."
      : Number(analytics.averageScore) >= 6
      ? "You are performing steadily, but some answers may lack structure or confidence. Try answering using clear STAR-format examples."
      : "Your practice consistency is improving. Focus on communication clarity, structured answers, and speaking confidently under pressure.";

  const recommendedTopics = [
    analytics.strongestRole,
    "Communication Skills",
    "Behavioral Questions",
    "Confidence Building",
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* ========================================= */}
        {/* WELCOME SECTION */}
        {/* ========================================= */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Welcome back,{" "}
              <span className="text-gradient">
                {user?.name || "User"}
              </span>
            </h1>

            <p className="text-muted-foreground mt-1">
              Track your interview growth and improve with AI-powered feedback.
            </p>
          </div>

          <Link href="/interview">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              <Play className="w-4 h-4 mr-2" />
              Start New Interview
            </Button>
          </Link>
        </div>

        {/* ========================================= */}
        {/* STATS GRID */}
        {/* ========================================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <AnimatedCard
              key={stat.label}
              delay={i}
              className="p-4 flex items-center space-x-4"
            >
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="text-2xl font-bold font-display">
                  {stat.value}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* ========================================= */}
        {/* MAIN CONTENT */}
        {/* ========================================= */}

        <div className="grid md:grid-cols-3 gap-6">
          {/* ========================================= */}
          {/* RECENT INTERVIEWS */}
          {/* ========================================= */}

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Recent Interviews
              </h2>

              <Link href="/history">
                <Button variant="ghost" className="text-primary hover:text-primary">
                  View all
                </Button>
              </Link>
            </div>

            {recentInterviews.length === 0 ? (
              <AnimatedCard className="p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <BarChart3 className="w-10 h-10 text-primary" />

                  <div>
                    <h3 className="font-semibold">
                      No interviews yet
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Start your first mock interview to unlock
                      analytics and AI insights.
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ) : (
              <div className="space-y-4">
                {recentInterviews.map((interview: any, i: number) => (
                  <AnimatedCard
                    key={interview.id}
                    delay={4 + i}
                    className="flex items-center justify-between p-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                        {interview?.score?.overall_score || 0}
                      </div>

                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {interview.role}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {interview.level} •{" "}
                          {interview.responses?.length || 0} Questions
                        </p>
                      </div>
                    </div>

                    <Link href={`/analytics/${interview.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </AnimatedCard>
                ))}
              </div>
            )}
          </div>

          {/* ========================================= */}
          {/* AI INSIGHTS */}
          {/* ========================================= */}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              AI Insights
            </h2>

            <AnimatedCard
              delay={7}
              className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-1" />

                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Performance Insight
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {aiInsight}
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={8} className="bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-primary" />

                <h3 className="font-semibold">
                  Recommended Focus Areas
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {recommendedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-secondary rounded-md text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </AnimatedCard>

            <AnimatedCard delay={9}>
              <h3 className="font-semibold mb-2">
                Interview Summary
              </h3>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • Total Questions Attempted:{" "}
                  <span className="text-white font-medium">
                    {analytics.totalQuestions}
                  </span>
                </p>

                <p>
                  • Most Practiced Role:{" "}
                  <span className="text-white font-medium">
                    {analytics.strongestRole}
                  </span>
                </p>

                <p>
                  • Estimated Practice Time:{" "}
                  <span className="text-white font-medium">
                    {analytics.estimatedPracticeHours} hours
                  </span>
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}