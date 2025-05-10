
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Toggle } from "@/components/ui/toggle";

// Map emotions to numerical values for visualization
const emotionValueMap: Record<string, number> = {
  "Joy": 9,
  "Happy": 8,
  "Contentment": 7,
  "Relaxed": 6,
  "Contemplative": 5,
  "Neutral": 5,
  "Concerned": 4,
  "Anxiety": 3,
  "Stress": 3,
  "Sadness": 2,
  "Depression": 1
};

// Get emotion value or default to middle (5)
const getEmotionValue = (emotion: string): number => {
  // Remove common words to try to match the base emotion
  const normalizedEmotion = emotion
    .replace(/I'm feeling|I feel|feeling|I am/gi, '')
    .trim();
  
  // Try to match with known emotions
  for (const knownEmotion in emotionValueMap) {
    if (normalizedEmotion.toLowerCase().includes(knownEmotion.toLowerCase())) {
      return emotionValueMap[knownEmotion];
    }
  }
  
  return 5; // Default to neutral if no match
};

// Count frequency of emotions
const countEmotions = (data: any[]) => {
  const emotionCounts: Record<string, number> = {};
  
  data.forEach(entry => {
    const emotion = entry.result.emotion;
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });
  
  return Object.entries(emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count) // Sort by frequency
    .slice(0, 5); // Take top 5 emotions
};

interface EmotionTrendChartProps {
  data: Array<{
    id: number;
    date: Date;
    entry: string;
    result: {
      emotion: string;
      analysis: string;
      advice: string;
    };
  }>;
}

const EmotionTrendChart = ({ data }: EmotionTrendChartProps) => {
  const [chartType, setChartType] = useState<"trend" | "frequency">("trend");
  
  // Prepare data for the trend chart
  const trendChartData = data
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      emotion: entry.result.emotion,
      value: getEmotionValue(entry.result.emotion)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  // Prepare data for the frequency chart
  const frequencyChartData = countEmotions(data);

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2">
        <Toggle
          pressed={chartType === "trend"}
          onPressedChange={() => setChartType("trend")}
          className="data-[state=on]:bg-primary/20"
        >
          Mood Trend
        </Toggle>
        <Toggle
          pressed={chartType === "frequency"}
          onPressedChange={() => setChartType("frequency")}
          className="data-[state=on]:bg-primary/20"
        >
          Emotion Frequency
        </Toggle>
      </div>

      <div className="h-80 w-full">
        {chartType === "trend" ? (
          <ChartContainer 
            className="w-full h-full" 
            config={{
              emotion: { label: "Emotional State", color: "hsl(var(--primary))" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickMargin={10} 
                />
                <YAxis 
                  domain={[1, 9]} 
                  ticks={[1, 3, 5, 7, 9]} 
                  tickFormatter={(value) => {
                    switch(value) {
                      case 9: return "Very Happy";
                      case 7: return "Happy";
                      case 5: return "Neutral";
                      case 3: return "Sad";
                      case 1: return "Very Sad";
                      default: return "";
                    }
                  }}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name, props) => {
                        const { payload } = props;
                        return (
                          <div>
                            <div className="font-medium">{payload.emotion}</div>
                          </div>
                        );
                      }}
                    />
                  } 
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="emotion"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ stroke: "hsl(var(--primary))", fill: "hsl(var(--background))", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <ChartContainer 
            className="w-full h-full" 
            config={{
              frequency: { label: "Frequency", color: "hsl(var(--primary))" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="emotion" 
                  tickMargin={10} 
                />
                <YAxis 
                  allowDecimals={false}
                  label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} 
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name, props) => {
                        return (
                          <div>
                            <div className="font-medium">Count: {value}</div>
                          </div>
                        );
                      }}
                    />
                  } 
                />
                <Bar
                  dataKey="count"
                  name="frequency"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
      
      {data.length < 3 && (
        <p className="text-center text-sm text-muted-foreground">
          Add more check-ins to see more detailed patterns in your emotional health
        </p>
      )}
    </div>
  );
};

export default EmotionTrendChart;
