
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProgressReportsProps {
  moodHistory: any[];
}

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

const ProgressReports = ({ moodHistory }: ProgressReportsProps) => {
  const [reportPeriod, setReportPeriod] = useState("week");
  const { toast } = useToast();

  // Generate weekly or monthly data from mood history
  const generateReportData = () => {
    if (!moodHistory.length) return { lineData: [], distributionData: [], insights: [] };
    
    // This is a simplified mock implementation
    // In a real app, you'd do proper date filtering and aggregation
    
    let lineData = [];
    const today = new Date();
    const distributionData = [];
    
    if (reportPeriod === "week") {
      // Generate last 7 days of data
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Find entries for this day
        const entriesForDay = moodHistory.filter(entry => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getDate() === date.getDate() &&
            entryDate.getMonth() === date.getMonth() &&
            entryDate.getFullYear() === date.getFullYear()
          );
        });
        
        // Calculate average mood score (mocked)
        let moodScore = 0;
        if (entriesForDay.length) {
          moodScore = entriesForDay.reduce((acc: number, entry: any) => {
            // Convert emotion to score (simplified)
            let score = 5; // neutral default
            const emotion = entry.result.emotion.toLowerCase();
            if (emotion.includes('joy') || emotion.includes('happy')) score = 8;
            else if (emotion.includes('content')) score = 7;
            else if (emotion.includes('sad')) score = 3;
            else if (emotion.includes('anxious') || emotion.includes('stress')) score = 2;
            return acc + score;
          }, 0) / entriesForDay.length;
        }
        
        lineData.push({
          day: dayStr,
          value: moodScore,
          entries: entriesForDay.length
        });
      }
    } else {
      // Monthly report - get last 30 days, grouped by week
      for (let week = 0; week < 4; week++) {
        lineData.push({
          day: `Week ${4 - week}`,
          value: Math.random() * 5 + 3, // Mock data
          entries: Math.floor(Math.random() * 10)
        });
      }
    }
    
    // Generate mood distribution data
    const emotionCounts: Record<string, number> = {};
    moodHistory.forEach((entry: any) => {
      const emotion = entry.result.emotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      distributionData.push({
        name: emotion,
        value: count
      });
    });
    
    // Generate mock insights
    const insights = [
      "Your average mood has improved by 15% compared to last week",
      "You've had 3 consecutive days of positive emotions",
      "Your mood tends to be highest on weekends",
      "Journaling appears to correlate with improved mood scores"
    ];
    
    return { lineData, distributionData, insights };
  };

  const { lineData, distributionData, insights } = generateReportData();

  const exportPDF = () => {
    // Mock function - in a real app, you would generate a PDF here
    toast({
      title: "Report exported",
      description: `Your ${reportPeriod}ly report has been downloaded as PDF.`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Reports
            </CardTitle>
            <CardDescription>
              Track your mental wellness journey over time
            </CardDescription>
          </div>
          <Select
            value={reportPeriod}
            onValueChange={setReportPeriod}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly Report</SelectItem>
              <SelectItem value="month">Monthly Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="charts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-6">
            {lineData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No mood data available for this period
              </div>
            ) : (
              <>
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Mood Trend</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2} 
                          name="Mood Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Emotion Distribution</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {distributionData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="pt-4 space-y-4">
              <h3 className="text-lg font-medium">AI-Generated Insights</h3>
              
              {insights.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No insights available yet. Continue tracking your mood to generate insights.
                </div>
              ) : (
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <Card key={index}>
                      <CardContent className="py-4">
                        <p>{insight}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="bg-secondary/30 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2">About These Insights</h4>
                <p className="text-sm text-muted-foreground">
                  These insights are generated based on patterns in your mood data. 
                  They're meant to help you identify trends and correlations, but 
                  should not be considered as medical advice.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={exportPDF}
          disabled={lineData.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgressReports;
