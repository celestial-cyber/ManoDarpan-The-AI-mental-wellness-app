
export interface MoodEntry {
  id: number;
  date: string;
  entry: string;
  result: {
    emotion: string;
    analysis: string;
    advice: string;
  };
}

/**
 * Calculate a wellness score based on mood history and streak data
 * 
 * @param moodHistory Array of mood entries
 * @param userStreak Current user streak
 * @returns A number between 0 and 100 representing the wellness score
 */
export function calculateWellnessScore(moodHistory: MoodEntry[], userStreak: number): number {
  if (!moodHistory.length) return 0;
  
  // Base score determined by the number of check-ins (max 40 points)
  const checkInScore = Math.min(moodHistory.length * 2, 40);
  
  // Calculate positivity score based on mood entries (max 40 points)
  const positiveEmotions = moodHistory.filter(entry => 
    entry.result.emotion.toLowerCase().includes('happy') || 
    entry.result.emotion.toLowerCase().includes('joy') ||
    entry.result.emotion.toLowerCase().includes('content')
  ).length;
  
  const positivePercentage = (positiveEmotions / moodHistory.length) * 100;
  const positivityScore = Math.min(positivePercentage * 0.4, 40);
  
  // Streak score (max 20 points)
  const streakScore = Math.min(userStreak * 5, 20);
  
  // Combine scores
  const wellnessScore = Math.round(checkInScore + positivityScore + streakScore);
  
  return wellnessScore;
}
