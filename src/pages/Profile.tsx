
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { useEffect } from "react";

const Profile = () => {
  // Mock user data (would normally come from a database)
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    joinDate: "May 2023",
    avatar: "" // Empty string will trigger the fallback
  });

  // Fetch mood history from localStorage
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch mood history from localStorage
    const storedEntries = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    setMoodHistory(storedEntries);
  }, []);

  // Calculate stats from history
  const stats = useMemo(() => {
    if (moodHistory.length === 0) {
      return {
        checkInsCount: 0,
        currentMood: { emotion: "No data", date: new Date() },
        mostFrequentEmotion: "No data",
        weeklyBreakdown: [],
        positivePercentage: 0
      };
    }
    
    // Current mood (most recent entry)
    const sortedHistory = [...moodHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const currentMood = sortedHistory[0];
    
    // Most frequent emotion
    const emotionCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.result.emotion] = (acc[entry.result.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostFrequentEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
      
    // Weekly breakdown - last 7 entries or fewer
    const weeklyEntries = sortedHistory.slice(0, 7);
    const weeklyBreakdown = weeklyEntries.map(entry => ({
      day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry.result.emotion.toLowerCase().includes('happy') ||
            entry.result.emotion.toLowerCase().includes('joy') ? 7 :
            entry.result.emotion.toLowerCase().includes('content') ? 6 :
            entry.result.emotion.toLowerCase().includes('neutral') ? 5 :
            entry.result.emotion.toLowerCase().includes('concerned') ? 4 :
            entry.result.emotion.toLowerCase().includes('anxious') ||
            entry.result.emotion.toLowerCase().includes('stress') ? 3 :
            entry.result.emotion.toLowerCase().includes('sad') ? 2 : 1,
      emotion: entry.result.emotion
    })).reverse();

    // Calculate percentage of positive emotions
    const positiveEmotions = moodHistory.filter(entry => 
      entry.result.emotion.toLowerCase().includes('happy') || 
      entry.result.emotion.toLowerCase().includes('joy') ||
      entry.result.emotion.toLowerCase().includes('content')
    ).length;
    
    // Fix: Ensure we're using numeric values for the calculation
    const positivePercentage = Math.round((positiveEmotions / moodHistory.length) * 100);
    
    return {
      checkInsCount: moodHistory.length,
      currentMood,
      mostFrequentEmotion,
      weeklyBreakdown,
      positivePercentage
    };
  }, [moodHistory]);

  // Mood distribution data for pie chart
  const moodDistribution = useMemo(() => {
    if (moodHistory.length === 0) return [];
    
    const distribution: Record<string, number> = {};
    moodHistory.forEach(entry => {
      const emotion = entry.result.emotion;
      distribution[emotion] = (distribution[emotion] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [moodHistory]);
  
  // Colors for the pie chart
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card-calm mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-1">{user.email}</p>
                <p className="text-muted-foreground mb-4">Member since {user.joinDate}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Mood</h3>
                    <p className="text-xl font-semibold">
                      {stats.currentMood.emotion || "No check-ins yet"}
                    </p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Most Frequent</h3>
                    <p className="text-xl font-semibold">{stats.mostFrequentEmotion}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-ins</h3>
                    <p className="text-xl font-semibold">{stats.checkInsCount}</p>
                  </div>
                </div>
                
                {stats.positivePercentage > 0 && (
                  <div className="mt-4 bg-calm-blue/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-1">Positive Emotions</h3>
                    <div className="w-full bg-secondary/50 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${stats.positivePercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">{stats.positivePercentage}% of your check-ins reflected positive emotions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-calm">
              <h2 className="text-2xl font-bold mb-6">Weekly Mood Trends</h2>
              {stats.weeklyBreakdown.length > 0 ? (
                <div className="h-80 w-full">
                  <ChartContainer 
                    className="w-full h-full" 
                    config={{
                      mood: { label: "Mood Score", color: "hsl(var(--primary))" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.weeklyBreakdown}>
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
          
          <div className="card-calm mt-6">
            <h2 className="text-2xl font-bold mb-6">Data Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline">Download Mood Journal (CSV)</Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Delete All Check-in Data
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
