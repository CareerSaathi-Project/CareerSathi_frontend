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
  Target
} from "lucide-react";
import { useInterviews } from "@/hooks/use-interviews";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: interviews } = useInterviews();

  // Mock stats - in real app would come from API
  const stats = [
    { label: "Total Interviews", value: interviews?.length || 12, icon: Target, color: "text-blue-500" },
    { label: "Average Score", value: "85%", icon: TrendingUp, color: "text-green-500" },
    { label: "Time Practiced", value: "4.5h", icon: Clock, color: "text-orange-500" },
    { label: "Streaks", value: "3 Days", icon: Trophy, color: "text-yellow-500" },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground mt-1">Ready to ace your next interview?</p>
          </div>
          <Link href="/interview">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Play className="w-4 h-4 mr-2" />
              Start New Interview
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <AnimatedCard key={stat.label} delay={i} className="p-4 flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Interviews</h2>
              <Link href="/history">
                <Button variant="link" className="text-primary">View all</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <AnimatedCard key={i} delay={4 + i} className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                      {85 + i}%
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">Frontend Developer</h3>
                      <p className="text-sm text-muted-foreground">Oct {24 - i}, 2023 • 15 min</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </AnimatedCard>
              ))}
            </div>
          </div>

          {/* Quick Tips / Recommendations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">AI Insights</h2>
            <AnimatedCard delay={7} className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">Improvement Area</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You tend to rush through system design questions. Try structuring your answer with requirements first.
                  </p>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={8} className="bg-card">
              <h3 className="font-semibold mb-2">Recommended Topic</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-secondary rounded-md text-xs">React Hooks</span>
                <span className="px-2 py-1 bg-secondary rounded-md text-xs">System Design</span>
                <span className="px-2 py-1 bg-secondary rounded-md text-xs">Algorithms</span>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
