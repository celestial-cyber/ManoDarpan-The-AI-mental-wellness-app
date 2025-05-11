
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { MoodEntry } from "@/utils/wellnessScore";
import { useProfileStats } from "@/hooks/use-profile-stats";

// Import our new components
import UserInfoCard from "@/components/profile/UserInfoCard";
import UserStats from "@/components/profile/UserStats";
import MoodCharts from "@/components/profile/MoodCharts";
import DataManagement from "@/components/profile/DataManagement";

const Profile = () => {
  // Mock user data (would normally come from a database)
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    joinDate: "May 2023",
    avatar: "", // Empty string will trigger the fallback
    streak: 4
  });

  // Fetch mood history from localStorage
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch mood history from localStorage
    const storedEntries = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    setMoodHistory(storedEntries);
  }, []);

  // Use our new hook to get profile stats
  const stats = useProfileStats(moodHistory, user.streak);

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
            <UserInfoCard user={user} moodHistory={moodHistory} />
            
            <UserStats 
              currentMood={stats.currentMood}
              mostFrequentEmotion={stats.mostFrequentEmotion}
              checkInsCount={stats.checkInsCount}
              wellnessScore={stats.wellnessScore}
              positivePercentage={stats.positivePercentage}
            />
          </div>
          
          <MoodCharts 
            weeklyBreakdown={stats.weeklyBreakdown}
            moodDistribution={stats.moodDistribution}
          />
          
          <DataManagement moodHistory={moodHistory} />
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
