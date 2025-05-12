import { useMemo } from "react";
import { MoodEntry, calculateWellnessScore } from "@/utils/wellnessScore";

export function useProfileStats(moodHistory: MoodEntry[], userStreak: number) {
  const stats = useMemo(() => {
    if (moodHistory.length === 0) {
      return {
        checkInsCount: 0,
        currentMood: { emotion: "No data", date: new Date() },
        mostFrequentEmotion: "No data",
        weeklyBreakdown: [],
        positivePercentage: 0,
        wellnessScore: 0,
        moodDistribution: []
      };
    }
    
    // Current mood (most recent entry)
    const sortedHistory = [...moodHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Map the MoodEntry to the expected currentMood shape
    const currentMood = {
      emotion: sortedHistory[0].result.emotion,
      date: new Date(sortedHistory[0].date)
    };
    
    // Most frequent emotion
    const emotionCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.result.emotion] = (acc[entry.result.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostFrequentEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
      
    // Weekly breakdown - last 7 entries or fewer
    const weeklyEntries = sortedHistory.slice(0, 7);
    const weeklyBreakdown = weeklyEntries.map(entry => ({
      day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry.result.emotion.toLowerCase().includes('happy') ||
            entry.result.emotion.toLowerCase().includes('joy') ? 7 :
            entry.result.emotion.toLowerCase().includes('content') ? 6 :
            entry.result.emotion.toLowerCase().includes('neutral') ? 5 :
            entry.result.emotion.toLowerCase().includes('concerned') ? 4 :
            entry.result.emotion.toLowerCase().includes('anxious') ||
            entry.result.emotion.toLowerCase().includes('stress') ? 3 :
            entry.result.emotion.toLowerCase().includes('sad') ? 2 : 1,
      emotion: entry.result.emotion
    })).reverse();

    // Calculate percentage of positive emotions
    const positiveEmotions = moodHistory.filter(entry => 
      entry.result.emotion.toLowerCase().includes('happy') || 
      entry.result.emotion.toLowerCase().includes('joy') ||
      entry.result.emotion.toLowerCase().includes('content')
    ).length;
    
    // Fix: Ensure we're using numeric values for the calculation by explicitly using Number()
    const totalEntries = Number(moodHistory.length);
    const positiveCount = Number(positiveEmotions);
    
    // Now both operands are guaranteed to be numbers
    const positivePercentage = totalEntries > 0 ? 
      Math.round((positiveCount / totalEntries) * 100) : 0;
    
    // Calculate wellness score
    const wellnessScore = calculateWellnessScore(moodHistory, userStreak);
    
    // Mood distribution data for pie chart
    const distribution: Record<string, number> = {};
    moodHistory.forEach(entry => {
      const emotion = entry.result.emotion;
      distribution[emotion] = (distribution[emotion] || 0) + 1;
    });
    
    const moodDistribution = Object.entries(distribution).map(([name, value]) => ({ name, value }));
    
    return {
      checkInsCount: moodHistory.length,
      currentMood,
      mostFrequentEmotion,
      weeklyBreakdown,
      positivePercentage,
      wellnessScore,
      moodDistribution
    };
  }, [moodHistory, userStreak]);

  return stats;
}
