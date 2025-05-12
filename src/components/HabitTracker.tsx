import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Droplet, Sun, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  target: number;
  dates: string[];
}

const HabitTracker = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "sleep",
      name: "Sleep",
      icon: <Moon className="h-4 w-4" />,
      value: 7,
      unit: "hours",
      target: 8,
      dates: [new Date().toISOString().split('T')[0]],
    },
    {
      id: "water",
      name: "Water",
      icon: <Droplet className="h-4 w-4" />,
      value: 5,
      unit: "glasses",
      target: 8,
      dates: [new Date().toISOString().split('T')[0]],
    },
    {
      id: "outdoors",
      name: "Outdoors",
      icon: <Sun className="h-4 w-4" />,
      value: 30,
      unit: "minutes",
      target: 60,
      dates: [new Date().toISOString().split('T')[0]],
    },
    {
      id: "exercise",
      name: "Exercise",
      icon: <Activity className="h-4 w-4" />,
      value: 15,
      unit: "minutes",
      target: 30,
      dates: [],
    },
  ]);

  const updateHabit = (id: string, increment: boolean) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const newValue = increment
            ? Math.min(habit.value + 1, habit.target * 2)
            : Math.max(0, habit.value - 1);
          
          let updatedDates = [...habit.dates];
          const today = new Date().toISOString().split('T')[0];
          
          if (newValue > 0 && !updatedDates.includes(today)) {
            updatedDates.push(today);
          } else if (newValue === 0 && updatedDates.includes(today)) {
            updatedDates = updatedDates.filter((date) => date !== today);
          }
          
          return { ...habit, value: newValue, dates: updatedDates };
        }
        return habit;
      })
    );
  };

  const getProgressPercentage = (habit: Habit) => {
    return Math.min(100, Math.round((habit.value / habit.target) * 100));
  };

  const getCorrelationWithMood = () => {
    // This is a mock function that would analyze real data to find correlations
    const mockCorrelations = [
      "Sleep quality shows a strong positive correlation with your mood ratings",
      "Days with 30+ minutes of outdoor time show improved mood scores",
      "Exercise days have 40% higher positivity scores than non-exercise days",
      "Missing your water intake target correlates with lower energy reports",
    ];
    
    return mockCorrelations[Math.floor(Math.random() * mockCorrelations.length)];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Habit Tracker</CardTitle>
        <CardDescription>
          Track habits that influence your mental wellbeing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="habits">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="habits">Daily Habits</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="habits" className="space-y-4 pt-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-secondary p-2 rounded-full">
                    {habit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{habit.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      Target: {habit.target} {habit.unit}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateHabit(habit.id, false)}
                    disabled={habit.value <= 0}
                  >
                    -
                  </Button>
                  
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">
                      {habit.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{habit.unit}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateHabit(habit.id, true)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
              <h3 className="font-medium mb-2">Insight</h3>
              <p className="text-sm text-muted-foreground">
                {getCorrelationWithMood()}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            
            {date && (
              <div className="mt-4">
                <h3 className="font-medium">
                  Habits for {date.toLocaleDateString()}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {habits.map((habit) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const completed = habit.dates.includes(dateStr);
                    
                    return (
                      <Badge
                        key={habit.id}
                        variant={completed ? "default" : "outline"}
                      >
                        {habit.icon}
                        <span className="ml-1">{habit.name}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            toast({
              title: "Habit analysis updated",
              description: "Your habit data has been analyzed for mood correlations.",
            });
          }}
        >
          Analyze Habits & Mood Correlation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
