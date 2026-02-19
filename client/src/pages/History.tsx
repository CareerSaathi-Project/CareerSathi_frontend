import { useInterviews } from "@/hooks/use-interviews";
import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Fallback mock data if API is empty
const MOCK_HISTORY = [
  { id: 1, role: "Frontend Developer", date: "2023-10-24", score: 85, level: "Senior" },
  { id: 2, role: "Backend Engineer", date: "2023-10-20", score: 72, level: "Mid-Level" },
  { id: 3, role: "Data Scientist", date: "2023-10-15", score: 90, level: "Senior" },
  { id: 4, role: "Product Manager", date: "2023-10-10", score: 65, level: "Junior" },
];

export default function History() {
  const { data: interviews, isLoading } = useInterviews();
  const [search, setSearch] = useState("");

  const displayData = (interviews && interviews.length > 0) ? interviews : MOCK_HISTORY;
  
  const filteredData = displayData.filter(item => 
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Interview History</h1>
            <p className="text-muted-foreground">Review your past performance and growth</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search roles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/50 border-white/10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 w-full bg-secondary/30 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((interview, index) => (
              <AnimatedCard 
                key={interview.id} 
                delay={index}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                    ${interview.score >= 80 ? 'bg-green-500/10 text-green-500' : 
                      interview.score >= 60 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}
                  `}>
                    {interview.score}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{interview.role}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(interview.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs h-5">{interview.level}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium">Feedback Mode</p>
                    <p className="text-xs text-muted-foreground">Constructive</p>
                  </div>
                  <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </Button>
                </div>
              </AnimatedCard>
            ))}
            
            {filteredData.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No interviews found matching "{search}"
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
