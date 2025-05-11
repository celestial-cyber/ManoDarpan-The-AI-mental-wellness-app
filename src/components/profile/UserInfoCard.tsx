
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";

interface UserInfoCardProps {
  user: {
    name: string;
    email: string;
    joinDate: string;
    avatar: string;
    streak: number;
  };
  moodHistory: any[];
}

const UserInfoCard = ({ user, moodHistory }: UserInfoCardProps) => {
  const badges = [
    { name: "First Check-in", achieved: moodHistory.length > 0, icon: <Calendar className="h-3 w-3" /> },
    { name: "5+ Check-ins", achieved: moodHistory.length >= 5, icon: <Calendar className="h-3 w-3" /> },
    { name: "Consistency Streak", achieved: user.streak >= 3, icon: <Award className="h-3 w-3" /> },
  ];

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
