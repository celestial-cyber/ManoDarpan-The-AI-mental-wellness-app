
import { useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface MoodChartsProps {
  weeklyBreakdown: Array<{
    day: string;
    mood: number;
    emotion: string;
  }>;
  moodDistribution: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

const MoodCharts = ({ weeklyBreakdown, moodDistribution }: MoodChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card-calm">
        <h2 className="text-2xl font-bold mb-6">Weekly Mood Trends</h2>
        {weeklyBreakdown.length > 0 ? (
          <div className="h-80 w-full">
            <ChartContainer 
              className="w-full h-full" 
              config={{
                mood: { label: "Mood Score", color: "hsl(var(--primary))" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value, name, props) => {
                          if (name === "mood") {
                            const entry = props.payload;
                            return (
                              <div>
                                <div className="font-medium">{entry.emotion}</div>
                                <div>Score: {value}/10</div>
                              </div>
                            );
                          }
                        }}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    name="mood"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            No check-ins recorded yet
          </div>
        )}
      </div>
      
      <div className="card-calm">
        <h2 className="text-2xl font-bold mb-6">Mood Distribution</h2>
        {moodDistribution.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            No check-ins recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCharts;
