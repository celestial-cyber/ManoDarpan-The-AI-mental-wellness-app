
/**
 * Utility functions for emotion detection and analysis
 */

// Pattern matching for various emotions in text
export const emotionPatterns = {
  anxiety: /anxious|worry|worrie|stress|panic|afraid|fear|nervous|tense|uneasy|apprehensive|dread|restless|on edge|jittery|can't relax|constant worry|overthinking/i,
  sadness: /sad|depress|down|unhappy|miserable|hopeless|blue|gloomy|lost|empty|grief|sorrow|heartbreak|disappointed|upset|lonely|alone|isolated|melancholy|despondent/i,
  anger: /angry|furious|mad|upset|irritate|frustrat|rage|hate|annoyed|resentful|bitter|hostile|outraged|fed up|ticked off|pissed|livid|enraged|seething/i,
  overwhelm: /overwhelm|too much|cannot cope|can't handle|exhausted|burnout|tired|drained|swamped|buried|too many|excessive|unbearable|crushing|suffocating|drowning in/i,
  joy: /happy|joy|excited|great|good|wonderful|fantastic|amazing|positive|delighted|pleased|content|thrilled|grateful|thankful|blessed|elated|overjoyed|ecstatic/i,
  fear: /scared|terrified|frightened|horror|alarmed|panicking|petrified|threatened|insecure|vulnerable|helpless|defenseless|exposed|unsafe/i,
  shame: /shame|embarrassed|humiliated|guilty|regret|remorse|foolish|stupid|inadequate|unworthy|exposed|mortified|disgraced|self-conscious/i,
  grief: /grief|mourning|loss|missing|yearning|devastated|bereft|heartbroken|bereavement|widow|widower|deceased|passed away|gone/i,
  confusion: /confused|unsure|uncertain|don't understand|lost|puzzled|perplexed|bewildered|disoriented|unclear|ambiguous|mixed signals|mixed messages/i,
  neutral: /ok|okay|fine|alright|so-so|neutral|average|medium|moderate|ordinary|typical|usual|regular/i
};

// Topic detection patterns
export const topicPatterns = {
  work: /work|job|boss|colleague|career|profession|workplace|unemploy|coworker|fired|layoff|promotion|office|business|client|deadline|project|workload|salary|paycheck|manager/i,
  relationships: /relationship|partner|spouse|boyfriend|girlfriend|dating|marriage|love|divorce|breakup|ex|romantic|affair|cheating|dating app|single|commitment|connection|intimacy|trust|loyalty/i,
  family: /family|parent|child|sibling|mother|father|son|daughter|brother|sister|grandparent|in-law|relative|mom|dad|kid|uncle|aunt|cousin|nephew|niece/i,
  health: /health|sick|illness|disease|pain|doctor|hospital|medication|symptom|diagnosis|chronic|condition|treatment|surgery|recovery|disability|medical|healthcare|wellness|therapy|appointment/i,
  finances: /money|financial|debt|afford|expensive|bills|payment|income|saving|budget|loan|mortgage|rent|cost|price|spend|bank|credit|investment|cash|salary|taxes|finance|poverty|wealthy|economic/i,
  education: /school|college|university|study|exam|homework|grade|professor|student|class|course|degree|assignment|teacher|learning|education|academic|knowledge|scholarship|graduation|major/i,
  social: /friend|social|lonely|alone|isolat|connection|community|belong|rejection|acceptance|party|gathering|socializing|group|club|peer|network|acquaintance|circle|hangout|meetup/i,
  identity: /identity|who I am|purpose|meaning|self-worth|value|belonging|fitting in|different|outsider|authentic|true self|gender|sexuality|cultural|racial|ethnic|religious|spiritual|personality/i,
  focus: /focus|concentrate|distract|attention|mind wander|scattered|forgetful|productivity|procrastinate|getting things done|brain fog|memory issues|spacing out|zoning out/i,
  sleep: /sleep|insomnia|nightmare|tired|exhausted|rest|awake|bed|nap|dream|snore|fatigue|drowsy|waking up|staying asleep|falling asleep|sleep quality|sleep pattern/i
};

// Common English stopwords to filter out when analyzing keywords
export const stopWords = new Set([
  "that", "this", "then", "than", "with", "would", "could", "should", "have", 
  "what", "when", "where", "why", "how", "like", "just", "very", "really", 
  "much", "many", "some", "other", "such", "from", "about", "been", "they", 
  "their", "them", "these", "those", "your", "yours", "mine", "ours", "theirs",
  "and", "but", "or", "nor", "for", "yet", "so", "although", "because", "since",
  "unless", "until", "while", "where", "after", "before", "if", "though", "even"
]);

/**
 * Detects emotion in text based on pattern matching
 */
export const detectEmotion = (text: string): { emotion: string; intensity: number } => {
  const lowerCase = text.toLowerCase();
  let highestMatchCount = 0;
  let detectedEmotion = "neutral";
  
  for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
    const matches = lowerCase.match(new RegExp(pattern, 'g'));
    if (matches && matches.length > highestMatchCount) {
      detectedEmotion = emotion;
      highestMatchCount = matches.length;
    }
  }
  
  // Calculate intensity based on match count and text length
  const intensity = Math.min(10, highestMatchCount + 2);
  
  return { emotion: detectedEmotion, intensity };
};

/**
 * Detects topics in text based on pattern matching
 */
export const detectTopics = (text: string): string[] => {
  const lowerCase = text.toLowerCase();
  const detectedTopics: string[] = [];
  
  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(lowerCase)) {
      detectedTopics.push(topic);
    }
  }
  
  return detectedTopics.length > 0 ? detectedTopics : ["general"];
};

/**
 * Detects intent in text based on patterns
 */
export const detectIntent = (text: string): "venting" | "seeking_advice" | "asking_question" | "sharing_experience" | "crisis" | "general" => {
  const lowerCase = text.toLowerCase();
  
  if (/\?|how|what|why|when|who|where|can you|should i|tell me|explain/i.test(lowerCase)) {
    return "asking_question";
  } else if (/help|advice|suggestion|recommend|what should|how can|need guidance|don't know what to do/i.test(lowerCase)) {
    return "seeking_advice";
  } else if (/feel like|feeling|I feel|I am|I'm|just need|listen|hear me|understand me/i.test(lowerCase)) {
    return "venting";
  } else if (/happened|experienced|went through|had a|I did|I went|I saw/i.test(lowerCase)) {
    return "sharing_experience";
  } else if (/suicid|kill myself|end my life|don't want to live|hurt myself|harming myself|self-harm|die|death|no point|can't go on/i.test(lowerCase)) {
    return "crisis";
  }
  
  return "general";
};

/**
 * Extract meaningful keywords from text
 */
export const extractKeywords = (text: string, maxWords: number = 8): string[] => {
  const words = text.toLowerCase().split(/\s+/);
  
  return words
    .filter(word => 
      word.length > 3 && 
      !stopWords.has(word) &&
      !/^[0-9]+$/.test(word) // filter out pure numbers
    )
    .slice(0, maxWords);
};

/**
 * Assess severity of mental health concerns in text
 */
export const assessSeverity = (text: string): "mild" | "moderate" | "severe" => {
  const lowerCase = text.toLowerCase();
  
  const severeTerms = [
    "suicid", "kill myself", "end my life", "don't want to live", "hurt myself", 
    "harming myself", "self-harm", "die", "death", "no point", "can't go on", 
    "not worth it", "better off without me", "plan to end", "no way out", "no hope"
  ];
  
  const moderateTerms = [
    "hopeless", "unbearable", "can't handle", "breaking down", "falling apart", 
    "desperate", "at my limit", "can't cope", "going crazy", "losing my mind"
  ];
  
  const intensifiers = [
    "very", "extremely", "really", "so", "too", "incredibly", "terribly", 
    "absolutely", "completely", "totally", "utterly", "deeply"
  ];
  
  // Check for severe terms first
  if (severeTerms.some(term => lowerCase.includes(term))) {
    return "severe";
  }
  
  // Then check for moderate terms or intensifiers with negative emotions
  const hasNegativeEmotion = emotionPatterns.anxiety.test(lowerCase) || 
                             emotionPatterns.sadness.test(lowerCase) ||
                             emotionPatterns.fear.test(lowerCase);
                             
  if (moderateTerms.some(term => lowerCase.includes(term)) ||
      (hasNegativeEmotion && intensifiers.some(term => lowerCase.includes(term)))) {
    return "moderate";
  }
  
  return "mild";
};
