
// Calculate a wellness score based on mood check-ins, consistency, and journaling quality
export const calculateWellnessScore = (moodHistory: any[], streak: number): number => {
  if (!moodHistory.length) return 0;
  
  // Base score from number of check-ins (up to 20 points)
  const checkInScore = Math.min(moodHistory.length * 2, 20);
  
  // Streak score (up to 15 points)
  const streakScore = Math.min(streak * 3, 15);
  
  // Consistency score based on regular check-ins (up to 25 points)
  // For this demo we'll use a simplified version
  const sortedEntries = [...moodHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let consistencyScore = 0;
  if (sortedEntries.length > 1) {
    // Check for at least one check-in every 48 hours
    let regularCheckIns = 0;
    for (let i = 1; i < sortedEntries.length; i++) {
      const prevDate = new Date(sortedEntries[i-1].date);
      const currDate = new Date(sortedEntries[i].date);
      const hoursDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff <= 48) {
        regularCheckIns++;
      }
    }
    
    consistencyScore = Math.min(Math.round((regularCheckIns / (sortedEntries.length - 1)) * 25), 25);
  }
  
  // Journal quality score based on length of entries (up to 20 points)
  const avgEntryLength = moodHistory.reduce((sum, entry) => sum + entry.entry.length, 0) / moodHistory.length;
  const journalScore = Math.min(Math.round(avgEntryLength / 10), 20);
  
  // Positivity score based on positive emotions (up to 20 points)
  const positiveEmotions = moodHistory.filter(entry => 
    entry.result.emotion.toLowerCase().includes('happy') || 
    entry.result.emotion.toLowerCase().includes('joy') ||
    entry.result.emotion.toLowerCase().includes('content')
  ).length;
  
  const positivityScore = Math.round((positiveEmotions / moodHistory.length) * 20);
  
  // Total score
  return Math.min(checkInScore + streakScore + consistencyScore + journalScore + positivityScore, 100);
};
