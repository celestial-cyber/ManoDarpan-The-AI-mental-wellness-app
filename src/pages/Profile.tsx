
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { MoodEntry } from "@/utils/wellnessScore";
import { useProfileStats } from "@/hooks/use-profile-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import our components
import UserInfoCard from "@/components/profile/UserInfoCard";
import UserStats from "@/components/profile/UserStats";
import MoodCharts from "@/components/profile/MoodCharts";
import DataManagement from "@/components/profile/DataManagement";
import PrivateNotes from "@/components/PrivateNotes";
import SOSButton from "@/components/SOSButton";
import AIChatCompanion from "@/components/AIChatCompanion";

const Profile = () => {
  // Get user data from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return {
      name: "Guest User",
      email: "guest@example.com",
      joinDate: new Date().toLocaleDateString(),
      avatar: "", // Empty string will trigger the fallback
      streak: 0,
      username: "guest_user"
    };
  });

  // Fetch mood history from localStorage
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch mood history from localStorage
    const storedEntries = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    setMoodHistory(storedEntries);
  }, []);

  // Use our new hook to get profile stats
  const stats = useProfileStats(moodHistory, user.streak);
  
  const handleUpdateUser = (userData: Partial<typeof user>) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };
  
  const handleLogout = () => {
    // In a real app with Supabase, you would call supabase.auth.signOut()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    
    // Clear localStorage items that contain user data
    localStorage.removeItem("currentUser");
    
    // Redirect to login page
    navigate("/");
  };

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Profile</h2>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            
            <UserInfoCard 
              user={user} 
              moodHistory={moodHistory}
              onUpdateUser={handleUpdateUser}
            />
            
            <UserStats 
              currentMood={stats.currentMood}
              mostFrequentEmotion={stats.mostFrequentEmotion}
              checkInsCount={stats.checkInsCount}
              wellnessScore={stats.wellnessScore}
              positivePercentage={stats.positivePercentage}
            />
          </div>
          
          <Tabs defaultValue="mood-analytics">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="mood-analytics">Mood Analytics</TabsTrigger>
              <TabsTrigger value="private-notes">Private Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mood-analytics" className="space-y-6">
              <MoodCharts 
                weeklyBreakdown={stats.weeklyBreakdown}
                moodDistribution={stats.moodDistribution}
              />
              
              <DataManagement moodHistory={moodHistory} />
            </TabsContent>
            
            <TabsContent value="private-notes">
              <PrivateNotes />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      <SOSButton />
      <AIChatCompanion />
    </div>
  );
};

export default Profile;
