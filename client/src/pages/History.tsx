import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom"; // ✅ React Router

const BASE_URL = "https://careersathi-rm5f.onrender.com";

type Interview = {
  id: number;
  role: string;
  date: string;
  score: number;
  level: string;
};

export default function History() {
  const { token } = useAuthStore();
  const navigate = useNavigate(); // ✅ useNavigate for navigation
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ===============================
  // Fetch Interviews from Backend
  // ===============================
  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/interview/history?skip=0&limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data && data.interviews) {
        const mapped: Interview[] = data.interviews.map((item: any) => ({
          id: item.id,
          role: item.role ?? "Unknown Role",
          date: item.created_at ?? new Date().toISOString(),
          score: item.score?.overall_score ?? item.score ?? 0,
          level: item.level ?? "Unknown",
        }));
        setInterviews(mapped);
      } else {
        setInterviews([]);
      }
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
      setInterviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return; // ✅ wait for token
    fetchInterviews();
  }, [token]); // ✅ re-run when token loads

  const filteredData = interviews.filter((item) =>
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  // ===============================
  // Navigate to single interview analytics
  // ===============================
  const handleClick = (id: number) => {
    navigate(`/analytics/${id}`); // ✅ navigate to analytics page with :id
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Interview History</h1>
            <p className="text-muted-foreground">
              Review your past performance and growth
            </p>
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

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full bg-secondary/30 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Interview List */}
            {filteredData.map((interview, index) => (
              <AnimatedCard
                key={interview.id}
                delay={index}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/[0.02] cursor-pointer"
                onClick={() => handleClick(interview.id)} // ✅ click navigates
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                      ${interview.score >= 80
                        ? "bg-green-500/10 text-green-500"
                        : interview.score >= 60
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"}
                    `}
                  >
                    {interview.score}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{interview.role}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(interview.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs h-5">
                        {interview.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium">Feedback Mode</p>
                    <p className="text-xs text-muted-foreground">Constructive</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </Button>
                </div>
              </AnimatedCard>
            ))}

            {/* No Results */}
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