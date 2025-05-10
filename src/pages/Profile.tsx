
import { useState } from "react";
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
  ResponsiveContainer 
} from "recharts";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const Profile = () => {
  // Mock user data (would normally come from a database)
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    joinDate: "May 2023",
    avatar: "" // Empty string will trigger the fallback
  });

  // Mock mood data for the past week
  const moodData = [
    { day: "Mon", mood: 3, emotion: "Anxious" },
    { day: "Tue", mood: 5, emotion: "Content" },
    { day: "Wed", mood: 4, emotion: "Neutral" },
    { day: "Thu", mood: 7, emotion: "Happy" },
    { day: "Fri", mood: 2, emotion: "Sad" },
    { day: "Sat", mood: 6, emotion: "Joyful" },
    { day: "Sun", mood: 5, emotion: "Relaxed" }
  ];

  // Calculate current mood (most recent entry)
  const currentMood = moodData[moodData.length - 1];
  
  // Determine the most frequent emotion in the past week
  const emotionCounts = moodData.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostFrequentEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Mood</h3>
                    <p className="text-xl font-semibold">{currentMood.emotion}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Most Frequent</h3>
                    <p className="text-xl font-semibold">{mostFrequentEmotion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-calm">
            <h2 className="text-2xl font-bold mb-6">Weekly Mood Trends</h2>
            
            <div className="h-80 w-full">
              <ChartContainer 
                className="w-full h-full" 
                config={{
                  mood: { label: "Mood Score", color: "hsl(var(--primary))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
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
            
            <div className="mt-6 text-center">
              <Button variant="outline">Download Mood Journal</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
