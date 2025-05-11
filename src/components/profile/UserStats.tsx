
interface UserStatsProps {
  currentMood: {
    emotion: string;
    date?: Date;
  };
  mostFrequentEmotion: string;
  checkInsCount: number;
  wellnessScore: number;
  positivePercentage: number;
}

const UserStats = ({ 
  currentMood,
  mostFrequentEmotion,
  checkInsCount,
  wellnessScore,
  positivePercentage
}: UserStatsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-secondary/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Mood</h3>
          <p className="text-xl font-semibold">
            {currentMood.emotion || "No check-ins yet"}
          </p>
        </div>
        <div className="bg-secondary/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Most Frequent</h3>
          <p className="text-xl font-semibold">{mostFrequentEmotion}</p>
        </div>
        <div className="bg-secondary/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-ins</h3>
          <p className="text-xl font-semibold">{checkInsCount}</p>
        </div>
      </div>
      
      <div className="mt-4 bg-calm-blue/20 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Wellness Score</h3>
          <span className="text-2xl font-bold">{wellnessScore}</span>
        </div>
        <div className="w-full bg-secondary/50 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${Math.min(wellnessScore, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1">Based on your check-ins, journaling, and streak</p>
      </div>
      
      {positivePercentage > 0 && (
        <div className="mt-4 bg-calm-blue/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Positive Emotions</h3>
          <div className="w-full bg-secondary/50 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${positivePercentage}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{positivePercentage}% of your check-ins reflected positive emotions</p>
        </div>
      )}
    </>
  );
};

export default UserStats;
