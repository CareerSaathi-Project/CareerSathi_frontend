import { useAnalytics } from "@/hooks/use-interviews";
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

// Mock Data
const MOCK_SCORE_TRENDS = [
  { date: 'Oct 1', score: 65 },
  { date: 'Oct 5', score: 70 },
  { date: 'Oct 10', score: 68 },
  { date: 'Oct 15', score: 75 },
  { date: 'Oct 20', score: 82 },
  { date: 'Oct 25', score: 88 },
];

const MOCK_ROLE_STATS = [
  { role: 'Frontend', score: 85 },
  { role: 'Backend', score: 72 },
  { role: 'System Design', score: 60 },
  { role: 'Behavioral', score: 90 },
];

const MOCK_SKILL_DISTRIBUTION = [
  { name: 'Technical', value: 400 },
  { name: 'Communication', value: 300 },
  { name: 'Problem Solving', value: 300 },
  { name: 'Experience', value: 200 },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'];

export default function Analytics() {
  // In a real app, use: const { data } = useAnalytics();
  // Using mocks for visual presentation
  
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your interview metrics</p>
        </div>

        {/* Score Trend Chart */}
        <AnimatedCard className="h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Score Progress</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={MOCK_SCORE_TRENDS}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
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
          <AnimatedCard delay={2} className="h-[350px]">
            <h3 className="text-lg font-semibold mb-6">Performance by Category</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={MOCK_ROLE_STATS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#ffffff10" />
                <XAxis type="number" stroke="#ffffff50" fontSize={12} hide />
                <YAxis dataKey="role" type="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                  {MOCK_ROLE_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </AnimatedCard>

          {/* Skill Distribution Pie Chart */}
          <AnimatedCard delay={3} className="h-[350px]">
            <h3 className="text-lg font-semibold mb-6">Question Distribution</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={MOCK_SKILL_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_SKILL_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-[-20px]">
              {MOCK_SKILL_DISTRIBUTION.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {item.name}
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
}
