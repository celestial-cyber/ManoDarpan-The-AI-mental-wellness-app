
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import WellnessToolkit from "../components/WellnessToolkit";
import CommunityBoard from "../components/CommunityBoard";
import RemindersSettings from "../components/RemindersSettings";
import CounselorConnect from "../components/CounselorConnect";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

const Dashboard = () => {
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState("Friend");
  
  useEffect(() => {
    // Check local storage for check-in data to calculate streak
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    if (moodHistory.length > 0) {
      // In a real app, you would calculate a true streak based on consecutive days
      // Here we'll just use the number of entries as an example
      setStreak(Math.min(moodHistory.length, 7));
    }
    
    // In a real app, you'd fetch the user's name from your auth provider
    const mockUserName = localStorage.getItem("userName") || "Friend";
    setUserName(mockUserName);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {userName}</h1>
            <p className="text-muted-foreground">Your wellness journey continues</p>
          </div>
          
          {streak > 0 && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md mx-auto mb-8 bg-calm-light dark:bg-accent/30 rounded-lg p-4 flex items-center justify-center gap-3"
            >
              <Award className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Current streak: {streak} day{streak !== 1 && 's'}</p>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
              <Badge variant="outline" className="ml-auto bg-primary/20">
                +{streak * 5} points
              </Badge>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <WellnessToolkit />
            <CommunityBoard />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RemindersSettings />
            <CounselorConnect />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
