
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HabitTracker from "../components/HabitTracker";
import ProgressReports from "../components/ProgressReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SOSButton from "@/components/SOSButton";
import AIChatCompanion from "@/components/AIChatCompanion";
import { MoodEntry } from "@/utils/wellnessScore";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileStats } from "@/hooks/use-profile-stats";
import { Translate, Language } from "lucide-react";

const Dashboard = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [language, setLanguage] = useState<string>("english");
  
  // Mock user streak
  const userStreak = 4;
  
  // Use our profile stats hook
  const stats = useProfileStats(moodHistory, userStreak);
  
  useEffect(() => {
    // Fetch mood history from localStorage
    const storedEntries = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    setMoodHistory(storedEntries);
  }, []);

  // Translation dictionary (simplified for demo)
  const translations = {
    english: {
      dashboard: "Dashboard",
      overview: "Overview",
      habits: "Habits",
      reports: "Reports",
      calendar: "Calendar",
      today: "Today",
      yourMood: "Your Mood",
      checkInsCount: "Check-ins",
      streak: "Current Streak",
      score: "Wellness Score",
      language: "Language",
      english: "English",
      hindi: "Hindi",
    },
    hindi: {
      dashboard: "डैशबोर्ड",
      overview: "अवलोकन",
      habits: "आदतें",
      reports: "रिपोर्ट",
      calendar: "कैलेंडर",
      today: "आज",
      yourMood: "आपका मूड",
      checkInsCount: "चेक-इन्स",
      streak: "वर्तमान स्ट्रीक",
      score: "वेलनेस स्कोर",
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिंदी",
    }
  };
  
  const t = translations[language as keyof typeof translations];

  // Find mood entries for selected date (from calendar)
  const findEntriesForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    
    return moodHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === selectedDate.getDate() &&
        entryDate.getMonth() === selectedDate.getMonth() &&
        entryDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };
  
  const selectedDateEntries = findEntriesForDate(date);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{t.dashboard}</h1>
            
            <div className="flex items-center gap-2">
              <Language className="h-4 w-4 text-muted-foreground" />
              <Select
                value={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={t.language} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">{t.english}</SelectItem>
                  <SelectItem value="hindi">{t.hindi}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">{t.overview}</TabsTrigger>
              <TabsTrigger value="habits">{t.habits}</TabsTrigger>
              <TabsTrigger value="reports">{t.reports}</TabsTrigger>
              <TabsTrigger value="calendar">{t.calendar}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{t.today}</h3>
                      <p className="text-2xl font-semibold">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{t.yourMood}</h3>
                      <p className="text-2xl font-semibold">
                        {stats.currentMood?.emotion || "No data"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{t.checkInsCount}</h3>
                      <p className="text-2xl font-semibold">{stats.checkInsCount}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{t.streak}</h3>
                      <p className="text-2xl font-semibold">{userStreak} days</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HabitTracker />
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t.score}</CardTitle>
                    <CardDescription>Based on your mood trends and check-in frequency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-[300px]">
                      <div className="relative h-48 w-48 flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="10"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-primary stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            strokeDasharray={`${stats.wellnessScore * 2.5}, 251.2`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute">
                          <p className="text-5xl font-bold">{stats.wellnessScore}</p>
                          <p className="text-sm text-muted-foreground text-center">out of 100</p>
                        </div>
                      </div>
                      <p className="mt-6 text-center">
                        {stats.positivePercentage}% positive emotions recorded
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="habits">
              <HabitTracker />
            </TabsContent>
            
            <TabsContent value="reports">
              <ProgressReports moodHistory={moodHistory} />
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>{t.calendar}</CardTitle>
                    <CardDescription>View your mood history by date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>
                      {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDateEntries.length === 0 
                        ? "No entries for this date" 
                        : `${selectedDateEntries.length} entries found`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedDateEntries.length === 0 ? (
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        No mood entries for this date
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedDateEntries.map((entry, index) => (
                          <div key={index} className="p-4 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{entry.result.emotion}</h3>
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.date).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{entry.entry}</p>
                            <p className="text-xs text-muted-foreground">{entry.result.analysis}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      <SOSButton />
      <AIChatCompanion />
    </div>
  );
};

export default Dashboard;
