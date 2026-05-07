import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { useAuthStore } from "@/hooks/use-auth";

const BASE_URL = "https://careersathi-rm5f.onrender.com";

const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'];

type InterviewAnalytics = {
  interview_id: number;
  role: string;
  level?: string;
  score?: {
    overall_score?: number;
    average_scores?: Record<string, number>;
    performance_level?: string;
    summary?: string;
  };
  total_questions?: number;
  question_breakdown?: Record<
    string,
    {
      feedback_samples?: any[];
      attempts?: number;
    }
  >;
};

export default function Analytics() {
  const { token } = useAuthStore();
  const { id } = useParams<{ id: string }>();

  const [interview, setInterview] = useState<InterviewAnalytics | null>(null);
  const [overallAnalytics, setOverallAnalytics] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===============================
  // Fetch analytics safely
  // ===============================
  const fetchAnalytics = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = id
        ? `${BASE_URL}/interview/${id}/analytics`
        : `${BASE_URL}/interview/analytics`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized access.");
        }

        if (res.status === 404) {
          throw new Error("Interview not found.");
        }

        throw new Error("Failed to fetch analytics.");
      }

      const data = await res.json();

      if (id) {
        setInterview(data);
        setOverallAnalytics(null);
      } else {
        setOverallAnalytics(data);
        setInterview(null);
      }
    } catch (err: any) {
      console.error("Fetch analytics error:", err);

      setError(err.message || "Something went wrong.");

      setInterview(null);
      setOverallAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id, token]);

  // ===============================
  // SINGLE INTERVIEW DATA
  // ===============================
  const averageScores = interview?.score?.average_scores || {};

  const scoreTrend = Object.entries(averageScores).map(([key, value]) => ({
    date: key,
    score: value,
  }));

  const roleStats = interview
    ? [
        {
          role: interview.role,
          score: interview.score?.overall_score || 0,
        },
      ]
    : [];

  const skillDist = Object.entries(averageScores).map(([key, value]) => ({
    name: key,
    value,
  }));

  // ===============================
  // OVERALL ANALYTICS DATA
  // ===============================
  const overallRoleStats = overallAnalytics
    ? Object.entries(overallAnalytics.roles_breakdown || {}).map(
        ([role, stats]: any) => ({
          role,
          score: stats.average_score,
        })
      )
    : [];

  const overallScoreCards = overallAnalytics
    ? [
        {
          label: "Average Score",
          value: overallAnalytics.average_score,
        },
        {
          label: "Highest Score",
          value: overallAnalytics.highest_score,
        },
        {
          label: "Lowest Score",
          value: overallAnalytics.lowest_score,
        },
        {
          label: "Total Interviews",
          value: overallAnalytics.total_interviews,
        },
      ]
    : [];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Performance Analytics
          </h1>

          <p className="text-muted-foreground">
            {id
              ? `Interview: ${interview?.role ?? "Unknown"} (${interview?.level ?? ""})`
              : "Overall Interview Analytics"}
          </p>
        </div>

        {isLoading ? (
          <div>Loading analytics...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : !id && overallAnalytics ? (
          <>
            {/* OVERALL SCORE CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {overallScoreCards.map((card) => (
                <AnimatedCard key={card.label} className="p-6">
                  <div className="text-sm text-muted-foreground">
                    {card.label}
                  </div>

                  <div className="text-3xl font-bold mt-2">
                    {card.value}
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* OVERALL ROLE PERFORMANCE */}
            <AnimatedCard className="h-[450px]">
              <h3 className="text-lg font-semibold mb-6">
                Role Performance Overview
              </h3>

              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={overallRoleStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                  />

                  <XAxis
                    dataKey="role"
                    stroke="#ffffff50"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="#ffffff50"
                    fontSize={12}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />

                  <Bar dataKey="score">
                    {overallRoleStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </AnimatedCard>
          </>
        ) : !interview ? (
          <div>No analytics available.</div>
        ) : (
          <>
            {/* Score Trend Chart */}
            <AnimatedCard className="h-[400px]">
              <h3 className="text-lg font-semibold mb-6">
                Score Progress
              </h3>

              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={scoreTrend}>
                  <defs>
                    <linearGradient
                      id="colorScore"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="95%"
                        stopColor="#8b5cf6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#ffffff50"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#ffffff50"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </AnimatedCard>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Role Performance Bar Chart */}
              <AnimatedCard className="h-[350px]">
                <h3 className="text-lg font-semibold mb-6">
                  Performance by Category
                </h3>

                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={roleStats} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal
                      vertical={false}
                      stroke="#ffffff10"
                    />

                    <XAxis
                      type="number"
                      stroke="#ffffff50"
                      fontSize={12}
                      hide
                    />

                    <YAxis
                      dataKey="role"
                      type="category"
                      stroke="#ffffff50"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />

                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                    />

                    <Bar
                      dataKey="score"
                      radius={[0, 4, 4, 0]}
                      barSize={32}
                    >
                      {roleStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </AnimatedCard>

              {/* Skill Distribution Pie Chart */}
              <AnimatedCard className="h-[350px]">
                <h3 className="text-lg font-semibold mb-6">
                  Question Distribution
                </h3>

                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={skillDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {skillDist.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="rgba(0,0,0,0)"
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-[-20px]">
                  {skillDist.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[index % COLORS.length]
                        }}
                      />

                      {item.name}
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}