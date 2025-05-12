import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserInfoCardProps {
  user: {
    name: string;
    email: string;
    joinDate: string;
    avatar: string;
    streak: number;
    username?: string;
  };
  moodHistory: any[];
  onUpdateUser?: (userData: Partial<UserInfoCardProps["user"]>) => void;
}

const UserInfoCard = ({ user, moodHistory, onUpdateUser }: UserInfoCardProps) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(user.username || user.name.split(' ')[0].toLowerCase());
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const { toast } = useToast();
  
  const badges = [
    { name: "First Check-in", achieved: moodHistory.length > 0, icon: <Calendar className="h-3 w-3" /> },
    { name: "5+ Check-ins", achieved: moodHistory.length >= 5, icon: <Calendar className="h-3 w-3" /> },
    { name: "Consistency Streak", achieved: user.streak >= 3, icon: <Award className="h-3 w-3" /> },
  ];
  
  const validateUsername = (value: string) => {
    setUsernameError("");
    
    if (!value) {
      setUsernameError("Username is required");
      return false;
    }
    
    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    
    if (value.length > 20) {
      setUsernameError("Username must be less than 20 characters");
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    
    return true;
  };
  
  const handleUpdateUsername = async () => {
    if (!validateUsername(username)) {
      return;
    }
    
    setIsCheckingUsername(true);
    
    try {
      // Simulate checking username against Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate username is taken 20% of the time for demo purposes
      // Skip check if it's the same as current username
      const currentUsername = user.username || user.name.split(' ')[0].toLowerCase();
      const isUsernameSame = username === currentUsername;
      const isUsernameTaken = !isUsernameSame && Math.random() < 0.2;
      
      if (isUsernameTaken) {
        setUsernameError("Username already taken. Please try another.");
        return;
      }
      
      // Username is available, update it
      // In a real app, this would update the Supabase profile
      if (onUpdateUser) {
        onUpdateUser({ 
          username,
          // Keep other user fields the same
          name: user.name,
          email: user.email,
          joinDate: user.joinDate,
          avatar: user.avatar,
          streak: user.streak
        });
      }
      
      // Also update in localStorage for demo
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      localStorage.setItem("currentUser", JSON.stringify({
        ...currentUser,
        username
      }));
      
      toast({
        title: "Username updated",
        description: `Your username is now ${username}`
      });
      
      setIsEditingUsername(false);
    } catch (error) {
      console.error("Error checking username:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingUsername(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
          {user.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        
        {isEditingUsername ? (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                placeholder="Enter new username"
                className="max-w-[200px]"
                disabled={isCheckingUsername}
              />
              <Button 
                onClick={handleUpdateUsername}
                disabled={isCheckingUsername}
                size="sm"
              >
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditingUsername(false);
                  setUsername(user.username || user.name.split(' ')[0].toLowerCase());
                  setUsernameError("");
                }}
                size="sm"
                disabled={isCheckingUsername}
              >
                Cancel
              </Button>
            </div>
            {usernameError && (
              <div className="text-sm font-medium text-destructive mt-1">
                {usernameError}
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground mb-1 flex items-center gap-2">
            @{user.username || username}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setIsEditingUsername(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </p>
        )}
        
        <p className="text-muted-foreground mb-1">{user.email}</p>
        <p className="text-muted-foreground mb-4">Member since {user.joinDate}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((badge, index) => (
            <Badge 
              key={index} 
              variant={badge.achieved ? "default" : "outline"}
              className={badge.achieved ? "bg-primary" : "text-muted-foreground"}
            >
              {badge.icon}
              <span className="ml-1">{badge.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
