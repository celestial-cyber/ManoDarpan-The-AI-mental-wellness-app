
import { useState, useEffect, useRef } from "react";
import { MessageCircle, SendIcon, Info, Book, Volume } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  category?: "support" | "coping" | "education" | "referral";
  suggestedResponses?: string[];
}

// Mental health resources for referrals
const MENTAL_HEALTH_RESOURCES = [
  {
    name: "Crisis Text Line",
    description: "Text HOME to 741741 for 24/7 crisis support",
    url: "https://www.crisistextline.org/",
  },
  {
    name: "National Suicide Prevention Lifeline",
    description: "Call 988 for 24/7 support if you're in crisis",
    url: "https://988lifeline.org/",
  },
  {
    name: "SAMHSA's National Helpline",
    description: "1-800-662-4357 - Treatment referral and information service",
    url: "https://www.samhsa.gov/find-help/national-helpline",
  },
  {
    name: "Psychology Today Therapist Finder",
    description: "Search for therapists in your area",
    url: "https://www.psychologytoday.com/us/therapists",
  },
];

// Educational content on common mental health topics
const EDUCATIONAL_CONTENT = {
  anxiety: {
    title: "Understanding Anxiety",
    content: "Anxiety is the body's natural response to stress. It's a feeling of fear or apprehension about what's to come. Everyone feels anxious now and then. It's a normal emotion. For example, you might feel worried when faced with a problem at work, before taking a test, or making an important decision.",
    coping: ["Practice deep breathing", "Try mindfulness meditation", "Limit caffeine and alcohol", "Regular physical exercise", "Get enough sleep"],
  },
  depression: {
    title: "About Depression",
    content: "Depression (major depressive disorder) is a common and serious medical illness that negatively affects how you feel, the way you think and how you act. Depression causes feelings of sadness and/or a loss of interest in activities you once enjoyed.",
    coping: ["Stay connected with supportive people", "Set realistic goals", "Exercise regularly", "Avoid alcohol and drugs", "Establish healthy sleep routines"],
  },
  stress: {
    title: "Managing Stress",
    content: "Stress is a normal human reaction that happens to everyone. In fact, the human body is designed to experience stress and react to it. When you experience changes or challenges (stressors), your body produces physical and mental responses. That's stress.",
    coping: ["Practice time management", "Set boundaries", "Take breaks throughout the day", "Connect with others", "Get regular physical activity"],
  },
  grief: {
    title: "Coping with Grief",
    content: "Grief is a natural response to loss. It's the emotional suffering you feel when something or someone you love is taken away. The pain of loss can feel overwhelming. You may experience all kinds of difficult and unexpected emotions, from shock or anger to disbelief, guilt, and profound sadness.",
    coping: ["Allow yourself to feel", "Express your feelings in a tangible way", "Maintain your hobbies and interests", "Don't let anyone tell you how to feel", "Take care of your physical health"],
  },
};

// Coping strategies by emotion
const COPING_STRATEGIES = {
  anxiety: [
    "Try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8",
    "Ground yourself by naming 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste",
    "Write down your worries to externalize them",
    "Go for a short walk outside",
    "Progressively relax your muscles from toes to head",
  ],
  sadness: [
    "Connect with a friend or family member who makes you feel supported",
    "Do a small act of kindness for someone else",
    "Create a gratitude list of 3 things you appreciate today",
    "Listen to music that brings you comfort",
    "Allow yourself to feel without judgment - emotions are temporary",
  ],
  anger: [
    "Take a timeout and step away from the situation",
    "Count slowly to 10 before responding",
    "Use 'I' statements to express your feelings without blame",
    "Try physical activity to release tension",
    "Write down what you're feeling without censoring yourself",
  ],
  overwhelm: [
    "Break down tasks into smaller, manageable steps",
    "Focus on just one thing at a time - multitasking increases stress",
    "Say no to additional commitments when you're at capacity",
    "Create a priority list and tackle the most important items first",
    "Schedule short breaks throughout your day to reset",
  ],
};

// Emotional response templates for more empathetic communication
const EMOTIONAL_RESPONSES = {
  anxiety: [
    "I can hear that anxiety is showing up for you right now. That feeling of {context} can be really challenging.",
    "When anxiety rises like that, it can feel so overwhelming. Your experience with {context} sounds really difficult.",
    "Anxiety can feel like it's taking over sometimes. I'm here to sit with you through these feelings about {context}.",
    "That anxious feeling around {context} is your body's way of responding to perceived threats, even when it's uncomfortable."
  ],
  sadness: [
    "I'm hearing how much sadness you're carrying right now about {context}. That heaviness is so valid.",
    "When sadness comes up around {context}, it can feel like a weight you're carrying. I'm here to listen.",
    "It sounds like you're feeling a deep sadness about {context}. Those emotions deserve space and acknowledgment.",
    "That sorrow around {context} makes sense given what you're going through. It's okay to feel this way."
  ],
  anger: [
    "I can hear the frustration and anger in what you're sharing about {context}. Those feelings are important messengers.",
    "Anger about {context} can be really intense. Your feelings are completely valid.",
    "When situations like {context} happen, anger is a natural response. It often points to boundaries that feel crossed.",
    "That anger around {context} is giving you important information about what matters to you."
  ],
  overwhelm: [
    "It sounds like you're carrying a lot right now with {context}. That feeling of being overwhelmed is your system telling you something important.",
    "When everything piles up like {context}, that overwhelmed feeling makes perfect sense. No one can handle everything at once.",
    "That sensation of being overwhelmed by {context} is so common, yet so difficult to navigate. Let's take this one step at a time.",
    "Feeling overwhelmed by {context} is your mind's way of saying it needs some support and perhaps some boundaries."
  ],
  fear: [
    "I can hear the fear coming through about {context}. Fear often arises when something matters deeply to us.",
    "That fear response around {context} is your mind trying to protect you, even though it feels uncomfortable.",
    "When fear comes up around {context}, it can feel all-consuming. Your feelings make sense given what you're facing.",
    "The fear you're experiencing about {context} is a very human response to uncertainty."
  ],
  joy: [
    "I can feel the joy coming through when you talk about {context}! Those positive moments are worth celebrating.",
    "That sense of joy around {context} sounds like such a meaningful experience for you.",
    "It's wonderful to hear about the joy you're finding in {context}. Those positive emotions are so important to notice and savor.",
    "Your happiness about {context} is really coming through - what a lovely thing to be experiencing!"
  ],
  neutral: [
    "Thank you for sharing about {context}. I'm curious to understand more about how that's affecting you.",
    "I appreciate you telling me about {context}. Could you share a bit about how that's making you feel?",
    "I'm listening to what you're saying about {context}. What emotions are coming up for you around this?",
    "I hear you talking about {context}. How is that situation sitting with you emotionally right now?"
  ]
};

// Validation responses that acknowledge user emotions
const VALIDATION_PHRASES = [
  "It makes complete sense that you'd feel that way about {context}.",
  "Your feelings about {context} are totally valid.",
  "Many people would feel similarly about {context}.",
  "That's such a natural response to what you're experiencing with {context}.",
  "I hear how {emotion} this situation with {context} is making you feel.",
  "It's completely understandable to feel {emotion} about {context}."
];

// Question templates to encourage deeper reflection
const REFLECTION_QUESTIONS = [
  "When you notice these feelings about {context}, where do you feel them in your body?",
  "Has anything like {context} happened before that brought up similar feelings?",
  "What do you think these feelings about {context} might be trying to tell you?",
  "If you could give this feeling about {context} a color or shape, what would it be?",
  "On a scale of 1-10, how intense are your feelings about {context} right now?",
  "What would help you feel even slightly better about {context} in this moment?"
];

// Breathing exercises for immediate support
const QUICK_BREATHING_EXERCISES = [
  {
    name: "Box Breathing",
    instructions: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5 times.",
    benefits: "Helps regulate the nervous system and reduce anxiety"
  },
  {
    name: "4-7-8 Breathing",
    instructions: "Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
    benefits: "Promotes relaxation and can help with falling asleep"
  },
  {
    name: "Mindful Breath Awareness",
    instructions: "Simply notice your natural breathing for 1 minute, without trying to change it.",
    benefits: "Brings you into the present moment and reduces racing thoughts"
  }
];

// Grounding techniques for moments of distress
const GROUNDING_TECHNIQUES = [
  "5-4-3-2-1 Technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
  "Hold a piece of ice in your hand and focus on the sensation as it melts.",
  "Name all the colors you can see in your surroundings right now.",
  "Place both feet firmly on the ground and notice the sensation of being supported.",
  "Gently trace the outline of your hand with your finger, focusing on the physical sensation."
];

const AIChatCompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm Mano, your mental wellness companion. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
      suggestedResponses: [
        "I'm feeling anxious",
        "I feel sad today",
        "I'm angry",
        "I'm feeling overwhelmed",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedBreathingExercise, setSelectedBreathingExercise] = useState<null | number>(null);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [journalPrompt, setJournalPrompt] = useState("");
  const [conversationContext, setConversationContext] = useState<{
    primaryEmotion: string;
    context: string;
    intensity: number;
    topics: string[];
    userConcerns: string[];
    previousResponses: string[];
    conversationStage: "initial" | "exploring" | "coping" | "reflection" | "closing";
    mentionedEvents: string[];
    responseStyle: "direct" | "reflective" | "educational" | "supportive";
  }>({
    primaryEmotion: "neutral",
    context: "",
    intensity: 0,
    topics: [],
    userConcerns: [],
    previousResponses: [],
    conversationStage: "initial",
    mentionedEvents: [],
    responseStyle: "supportive",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Enhanced contextual message analysis with semantic understanding
  const analyzeMessage = (message: string, previousMessages: Message[]): {
    emotionDetected: string;
    severity: "mild" | "moderate" | "severe";
    topics: string[];
    keywords: string[];
    context: string;
    intent: "venting" | "seeking_advice" | "asking_question" | "sharing_experience" | "crisis" | "general";
    mentionedEvents: string[];
  } => {
    const lowerCase = message.toLowerCase();
    
    // Extract previous user messages for context
    const previousUserMessages = previousMessages
      .filter(msg => msg.sender === "user")
      .map(msg => msg.text)
      .slice(-3); // Look at last 3 user messages for context
    
    // Join all context for better understanding
    const contextualContent = [message, ...previousUserMessages].join(" ");
    
    // Enhanced emotion detection with comprehensive patterns and intensity markers
    let emotionDetected = "neutral";
    let emotionIntensity = 0;
    
    const emotionPatterns = {
      anxiety: /anxious|worry|worrie|stress|panic|afraid|fear|nervous|tense|uneasy|apprehensive|dread|restless|on edge|jittery|can't relax|constant worry|overthinking/i,
      sadness: /sad|depress|down|unhappy|miserable|hopeless|blue|gloomy|lost|empty|grief|sorrow|heartbreak|disappointed|upset|lonely|alone|isolated|melancholy|despondent/i,
      anger: /angry|furious|mad|upset|irritate|frustrat|rage|hate|annoyed|resentful|bitter|hostile|outraged|fed up|ticked off|pissed|livid|enraged|seething/i,
      overwhelm: /overwhelm|too much|cannot cope|can't handle|exhausted|burnout|tired|drained|swamped|buried|too many|excessive|unbearable|crushing|suffocating|drowning in/i,
      joy: /happy|joy|excited|great|good|wonderful|fantastic|amazing|positive|delighted|pleased|content|thrilled|grateful|thankful|blessed|elated|overjoyed|ecstatic/i,
      fear: /scared|terrified|frightened|horror|alarmed|panicking|petrified|threatened|insecure|vulnerable|helpless|defenseless|exposed|unsafe/i,
      shame: /shame|embarrassed|humiliated|guilty|regret|remorse|foolish|stupid|inadequate|unworthy|exposed|mortified|disgraced|self-conscious/i,
      grief: /grief|mourning|loss|missing|yearning|devastated|bereft|heartbroken|bereavement|widow|widower|deceased|passed away|gone/i,
      confusion: /confused|unsure|uncertain|don't understand|lost|puzzled|perplexed|bewildered|disoriented|unclear|ambiguous|mixed signals|mixed messages/i
    };
    
    // Check for emotion patterns and count matches to determine intensity
    let highestMatchCount = 0;
    
    for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
      const matches = contextualContent.match(new RegExp(pattern, 'g'));
      if (matches && matches.length > highestMatchCount) {
        emotionDetected = emotion;
        highestMatchCount = matches.length;
        emotionIntensity = Math.min(10, matches.length + 2); // Scale intensity with number of matches
      }
    }
    
    // Detecting intent in the user's message
    let intent: "venting" | "seeking_advice" | "asking_question" | "sharing_experience" | "crisis" | "general" = "general";
    
    if (/\?|how|what|why|when|who|where|can you|should i|tell me|explain/i.test(message)) {
      intent = "asking_question";
    } else if (/help|advice|suggestion|recommend|what should|how can|need guidance|don't know what to do/i.test(message)) {
      intent = "seeking_advice";
    } else if (/feel like|feeling|I feel|I am|I'm|just need|listen|hear me|understand me/i.test(message)) {
      intent = "venting";
    } else if (/happened|experienced|went through|had a|I did|I went|I saw/i.test(message)) {
      intent = "sharing_experience";
    }
    
    // Detecting severity more comprehensively
    let severity: "mild" | "moderate" | "severe" = "mild";
    
    const intensifiers = ["very", "extremely", "really", "so", "too", "incredibly", "terribly", "absolutely", "completely", "totally", "utterly", "deeply", "profoundly", "immensely", "exceptionally"];
    const severeTerms = ["suicid", "kill myself", "end my life", "don't want to live", "hurt myself", "harming myself", "self-harm", "die", "death", "no point", "can't go on", "not worth it", "better off without me", "plan to end", "no way out", "no hope", "can't take it anymore"];
    const moderateTerms = ["hopeless", "unbearable", "can't handle", "breaking down", "falling apart", "desperate", "at my limit", "can't cope", "going crazy", "losing my mind"];
    
    // Check for crisis/severe content first
    if (severeTerms.some(term => contextualContent.includes(term))) {
      severity = "severe";
      intent = "crisis";
    } 
    // Then check for moderate terms
    else if (moderateTerms.some(term => contextualContent.includes(term)) ||
        intensifiers.some(term => contextualContent.includes(term) && emotionDetected !== "neutral") ||
        emotionIntensity >= 6) {
      severity = "moderate";
    }
    
    // Enhanced topic detection with context awareness
    const topicPatterns = {
      work: /work|job|boss|colleague|career|profession|workplace|unemploy|coworker|fired|layoff|promotion|office|business|client|deadline|project|workload|salary|paycheck|manager/i,
      relationships: /relationship|partner|spouse|boyfriend|girlfriend|dating|marriage|love|divorce|breakup|ex|romantic|affair|cheating|dating app|single|commitment|connection|intimacy|trust|loyalty/i,
      family: /family|parent|child|sibling|mother|father|son|daughter|brother|sister|grandparent|in-law|relative|mom|dad|kid|uncle|aunt|cousin|nephew|niece/i,
      health: /health|sick|illness|disease|pain|doctor|hospital|medication|symptom|diagnosis|chronic|condition|treatment|surgery|recovery|disability|medical|healthcare|wellness|therapy|appointment/i,
      finances: /money|financial|debt|afford|expensive|bills|payment|income|saving|budget|loan|mortgage|rent|cost|price|spend|bank|credit|investment|cash|salary|taxes|finance|poverty|wealthy|economic/i,
      education: /school|college|university|study|exam|homework|grade|professor|student|class|course|degree|assignment|teacher|learning|education|academic|knowledge|scholarship|graduation|major/i,
      social: /friend|social|lonely|alone|isolat|connection|community|belong|rejection|acceptance|party|gathering|socializing|group|club|peer|network|acquaintance|circle|hangout|meetup/i,
      identity: /identity|who I am|purpose|meaning|self-worth|value|belonging|fitting in|different|outsider|authentic|true self|gender|sexuality|cultural|racial|ethnic|religious|spiritual|personality/i,
      future: /future|plan|goal|dream|aspiration|direction|purpose|vision|next step|career path|life path|uncertainty|decision|crossroads|choice|option|possibility|outlook|tomorrow|potential/i,
      past: /past|childhood|history|trauma|memory|remember|used to|before|previous|regret|mistake|former|earlier|younger|background|nostalgia|reminisce|flashback|upbringing|experience/i,
      selfEsteem: /confidence|self-esteem|worth|value|failure|success|achievement|comparison|not good enough|inadequate|proud|disappointed in myself|body image|self-image|self-perception|self-doubt/i,
      grief: /grief|loss|death|died|passed away|gone|missing|bereavement|funeral|deceased|memorial|mourn|grieve|remembrance|anniversary|legacy|coping with loss|widowed/i,
      trauma: /trauma|abuse|assault|violence|ptsd|flashback|trigger|nightmare|terrifying|incident|accident|victim|survivor|recovery|processing|healing|coping|violent|catastrophic/i,
      substance: /addict|alcohol|drunk|drinking|drug|substance|using|sober|recovery|relapse|high|withdrawal|dependency|habit|coping mechanism|self-medication/i,
      focus: /focus|concentrate|distract|attention|mind wander|scattered|forgetful|productivity|procrastinate|getting things done|brain fog|memory issues|spacing out|zoning out/i,
      sleep: /sleep|insomnia|nightmare|tired|exhausted|rest|awake|bed|nap|dream|snore|fatigue|drowsy|waking up|staying asleep|falling asleep|sleep quality|sleep pattern/i
    };
    
    const topics: string[] = [];
    for (const [topic, pattern] of Object.entries(topicPatterns)) {
      if (pattern.test(contextualContent)) {
        topics.push(topic);
      }
    }
    
    // Extract mentioned events more intelligently
    const eventPatterns = [
      /(?:yesterday|today|this morning|last night|earlier|recently|just now|a while ago|few days ago|last week|month ago|year ago)\s+(.*?)(?:\.|\?|!|$)/i,
      /(?:happened|occurred|experienced|went through|dealt with|faced)\s+(.*?)(?:\.|\?|!|$)/i,
      /(?:after|when|during|before)\s+(.*?)(?:\.|\?|!|$)/i
    ];
    
    let mentionedEvents: string[] = [];
    
    eventPatterns.forEach(pattern => {
      const match = message.match(pattern);
      if (match && match[1]) {
        mentionedEvents.push(match[1].trim());
      }
    });
    
    // Extract context more intelligently with better pattern matching
    let context = "";
    
    // Look for phrases that indicate context
    const emotionWords = ["feel", "feeling", "felt", "am", "experiencing", "going through", "dealing with", "struggling with"];
    for (const word of emotionWords) {
      const match = message.match(new RegExp(`${word}\\s+(.*?)\\s+(?:about|because|due to|from|with|when|after|by|over|regarding|concerning|since|for)\\s+(.*?)(?:\\.|\\?|\\!|$)`, "i"));
      if (match && match[2]) {
        context = match[2].trim();
        break;
      }
    }
    
    // If no context found yet, look for more general context indicators
    if (!context) {
      const contextPatterns = [
        /(?:because|due to|from|as|since)\s+(.*?)(?:\.|\?|\!|$)/i,
        /(?:about|regarding|concerning|over|with)\s+(.*?)(?:\.|\?|\!|$)/i,
        /(?:when|after|during|while)\s+(.*?)(?:\.|\?|\!|$)/i
      ];
      
      for (const pattern of contextPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
          context = match[1].trim();
          break;
        }
      }
    }
    
    // If still no context but we have topics and emotions, create a synthetic context
    if (!context && emotionDetected !== "neutral" && topics.length > 0) {
      context = `your ${topics[0]} situation`;
    } else if (!context && emotionDetected !== "neutral") {
      context = "what you're going through";
    } else if (!context) {
      context = "your situation";
    }
    
    // Extract more meaningful keywords for better contextual understanding
    const words = lowerCase.split(/\s+/);
    const stopWords = new Set([
      "that", "this", "then", "than", "with", "would", "could", "should", "have", 
      "what", "when", "where", "why", "how", "like", "just", "very", "really", 
      "much", "many", "some", "other", "such", "from", "about", "been", "they", 
      "their", "them", "these", "those", "your", "yours", "mine", "ours", "theirs",
      "and", "but", "or", "nor", "for", "yet", "so", "although", "because", "since",
      "unless", "until", "while", "where", "after", "before", "if", "though", "even"
    ]);
    
    const keywords = words
      .filter(word => 
        word.length > 3 && 
        !stopWords.has(word) &&
        !/^[0-9]+$/.test(word) // filter out pure numbers
      )
      .slice(0, 8); // Take top 8 meaningful keywords
    
    return {
      emotionDetected,
      severity,
      topics: topics.length ? topics : ["general"],
      keywords,
      context,
      intent,
      mentionedEvents
    };
  };

  // Enhanced response generation system with advanced emotional intelligence and contextual awareness
  const getAIResponse = (userMessage: string): Message => {
    // Analyze the current message in the context of the previous conversation
    const analysis = analyzeMessage(userMessage, messages);
    const { 
      emotionDetected, 
      severity, 
      topics, 
      keywords, 
      context, 
      intent,
      mentionedEvents
    } = analysis;
    
    // Update conversation context to maintain continuity
    const updatedContext = {
      ...conversationContext,
      primaryEmotion: emotionDetected !== "neutral" ? emotionDetected : conversationContext.primaryEmotion,
      context: context || conversationContext.context,
      intensity: severity === "severe" ? 8 : (severity === "moderate" ? 5 : 3),
      userConcerns: [...conversationContext.userConcerns]
    };
    
    // Add new topics to tracked topics if not already present
    topics.forEach(topic => {
      if (!updatedContext.topics.includes(topic)) {
        updatedContext.topics = [topic, ...updatedContext.topics].slice(0, 3); // Keep 3 most recent topics
      }
    });
    
    // Add any new mentioned events
    mentionedEvents.forEach(event => {
      if (!updatedContext.mentionedEvents.includes(event)) {
        updatedContext.mentionedEvents = [event, ...updatedContext.mentionedEvents].slice(0, 3);
      }
    });
    
    // Extract potential concerns from user message
    const potentialConcerns = keywords.filter(keyword => 
      !updatedContext.userConcerns.includes(keyword) && 
      !/^(feel|feeling|felt|think|thought|going|want|wanted|need|needed)$/.test(keyword)
    );
    
    // Add new concerns but limit to 5 most recent
    updatedContext.userConcerns = [
      ...potentialConcerns, 
      ...updatedContext.userConcerns
    ].slice(0, 5);
    
    // Progress the conversation stage based on message count and content
    if (updatedContext.conversationStage === "initial") {
      updatedContext.conversationStage = "exploring";
    } else if (updatedContext.conversationStage === "exploring" && messages.length > 4) {
      updatedContext.conversationStage = "coping";
    } else if (updatedContext.conversationStage === "coping" && messages.length > 8) {
      updatedContext.conversationStage = "reflection";
    } else if (updatedContext.conversationStage === "reflection" && messages.length > 12) {
      updatedContext.conversationStage = "closing";
    }
    
    // Adjust response style based on user intent and conversation flow
    if (intent === "asking_question" || userMessage.includes("?")) {
      updatedContext.responseStyle = "educational";
    } else if (intent === "seeking_advice" || updatedContext.conversationStage === "coping") {
      updatedContext.responseStyle = "direct";
    } else if (intent === "venting") {
      updatedContext.responseStyle = "supportive";
    } else if (updatedContext.conversationStage === "reflection") {
      updatedContext.responseStyle = "reflective";
    }
    
    // Save the updated context
    setConversationContext(updatedContext);
    
    // Determine response category and compose contextually appropriate response
    let category: "support" | "coping" | "education" | "referral" = "support";
    let responseText = "";
    let suggestedResponses: string[] = [];
    
    // Handle severe cases with referral - crisis priority
    if (severity === "severe") {
      category = "referral";
      
      // Highly personalized empathetic crisis response
      const emotionPhrase = emotionDetected !== "neutral" ? 
        `I notice you're experiencing intense ${emotionDetected}` : 
        "I hear that you're going through something really difficult";
        
      // Reference specific words or content from user's message to show deep listening
      const userConcernPhrase = updatedContext.userConcerns.length > 0 ? 
        `when you mention ${updatedContext.userConcerns[0]}` : 
        "in what you're sharing";
        
      responseText = `${emotionPhrase} right now, especially ${userConcernPhrase}. I'm genuinely concerned about your wellbeing and safety. ` +
        `This level of emotional pain can feel overwhelming, and you deserve immediate support from someone specially trained to help. ` +
        `Would you be open to reaching out to one of these crisis resources where compassionate people are available 24/7? ` +
        `They're experienced in helping people navigate these exact kinds of intense feelings.`;
        
      suggestedResponses = [
        "Yes, I'd like to see those resources", 
        "I'm not ready for that yet", 
        "What else can help me right now?",
        "Can you just listen for a bit longer?"
      ];
    } 
    // For moderate cases or coping stage, provide targeted coping strategies
    else if (severity === "moderate" || updatedContext.conversationStage === "coping") {
      category = "coping";
      
      // Get emotional validation and coping strategies with context awareness
      const emotionResponses = EMOTIONAL_RESPONSES[emotionDetected as keyof typeof EMOTIONAL_RESPONSES] || EMOTIONAL_RESPONSES.neutral;
      const validationPhrases = VALIDATION_PHRASES;
      
      // Select response templates and personalize them with user's own words/context
      const emotionResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
        .replace("{context}", updatedContext.context);
      
      const validationPhrase = validationPhrases[Math.floor(Math.random() * validationPhrases.length)]
        .replace("{context}", updatedContext.context)
        .replace("{emotion}", emotionDetected);
      
      // Reference something specific the user mentioned to demonstrate active listening
      let specificReference = "";
      if (updatedContext.mentionedEvents.length > 0) {
        specificReference = `You mentioned ${updatedContext.mentionedEvents[0]}, which sounds really significant. `;
      } else if (updatedContext.userConcerns.length > 0) {
        specificReference = `I notice ${updatedContext.userConcerns[0]} is important in what you're sharing. `;
      }
      
      // Get appropriate coping strategies based on detected emotion
      const strategies = COPING_STRATEGIES[emotionDetected as keyof typeof COPING_STRATEGIES] || COPING_STRATEGIES.anxiety;
      
      // Select strategies most relevant to the user
      const strategy1 = strategies[0];
      const strategy2 = strategies[1];
      
      responseText = `${emotionResponse} ${validationPhrase} ${specificReference}` +
        `Would you like to try a technique that might help with these feelings? ` +
        `One approach is to ${strategy1.toLowerCase()}. Or you could ${strategy2.toLowerCase()}.`;
      
      suggestedResponses = [
        "I'd like to try a breathing exercise", 
        "Tell me more coping strategies", 
        "I just need someone to listen",
        "What causes these feelings?"
      ];
    }
    // For educational content when user is asking questions or showing curiosity
    else if (intent === "asking_question" || updatedContext.responseStyle === "educational" || topics.some(t => Object.keys(EDUCATIONAL_CONTENT).includes(t))) {
      category = "education";
      
      // Find relevant educational content based on topics and emotions
      const relevantTopic = topics.find(topic => Object.keys(EDUCATIONAL_CONTENT).includes(topic)) || 
                          (emotionDetected !== "neutral" && Object.keys(EDUCATIONAL_CONTENT).includes(emotionDetected)) ? 
                          emotionDetected : "anxiety"; // default to anxiety if no match
      
      // Get educational content for the topic
      const content = EDUCATIONAL_CONTENT[relevantTopic as keyof typeof EDUCATIONAL_CONTENT];
      
      responseText = `I understand you'd like to learn more about this. ${content.title}: ${content.content.substring(0, 200)}... ` +
        `Would you like to know more about ${relevantTopic}, including ways to manage it?`;
      
      suggestedResponses = [
        "Yes, tell me more", 
        "What are some coping strategies?", 
        "How common is this experience?",
        "Let's talk about something else"
      ];
    }
    // Default to supportive, reflective response
    else {
      category = "support";
      
      // Get reflective questions to encourage deeper exploration
      const reflectionQs = REFLECTION_QUESTIONS;
      
      // Personalize reflection question with user's context
      const reflectionQ = reflectionQs[Math.floor(Math.random() * reflectionQs.length)]
        .replace("{context}", updatedContext.context);
      
      // Get emotional validation with context awareness
      const emotionResponses = EMOTIONAL_RESPONSES[emotionDetected as keyof typeof EMOTIONAL_RESPONSES] || EMOTIONAL_RESPONSES.neutral;
      
      // Select response template and personalize with user's own words/context
      const emotionResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
        .replace("{context}", updatedContext.context);
      
      responseText = `${emotionResponse} ${reflectionQ}`;
      
      suggestedResponses = [
        "Actually, I'd like to try a breathing exercise", 
        "Can you suggest some coping strategies?", 
        "I'd like to learn more about these feelings",
        "I just want to continue talking"
      ];
    }
    
    // Create the AI response message object
    return {
      id: `ai-${Date.now()}`,
      text: responseText,
      sender: "ai",
      timestamp: new Date(),
      category,
      suggestedResponses
    };
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add the user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI thinking
    setIsTyping(true);

    // Generate AI response with slight delay to feel more natural
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage.text);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle clicking on a suggested response
  const handleSuggestedResponse = (response: string) => {
    // Add the user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: response,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI thinking
    setIsTyping(true);

    // Generate AI response with slight delay to feel more natural
    setTimeout(() => {
      const aiResponse = getAIResponse(response);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Handle breathing exercise selection
  const handleBreathingExerciseSelect = (index: number) => {
    setSelectedBreathingExercise(index);
  };

  // Generate a journal prompt based on current conversation context
  const generateJournalPrompt = () => {
    const prompts = [
      `How did your feelings about ${conversationContext.context} change throughout the day?`,
      `What are three things that triggered your ${conversationContext.primaryEmotion} today?`,
      `If your ${conversationContext.primaryEmotion} could speak, what would it say to you?`,
      `Write about a time when you successfully managed similar feelings of ${conversationContext.primaryEmotion}.`,
      `What would you tell a friend who was experiencing the same ${conversationContext.primaryEmotion} about ${conversationContext.context}?`,
    ];

    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  // Handle journal prompt generation
  const handleShowJournalPrompt = () => {
    const prompt = generateJournalPrompt();
    setJournalPrompt(prompt);
    setShowJournalPrompt(true);
  };

  // Save journal entry
  const handleSaveJournalEntry = () => {
    if (journalEntry.trim()) {
      toast({
        title: "Journal Entry Saved",
        description: "Your thoughts have been recorded.",
      });
    }
    setShowJournalPrompt(false);
    setJournalEntry("");
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 left-6 rounded-full w-14 h-14 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 z-50 md:bottom-8 md:left-8"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold flex items-center">
              <Avatar className="h-8 w-8 bg-primary/20 mr-2">
                <MessageCircle className="h-4 w-4 text-primary" />
              </Avatar>
              Mano: AI Wellness Companion
            </DialogTitle>
            <DialogDescription>
              A supportive space to reflect and find mental wellness resources.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="chat" className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="exercises" className="flex items-center">
                  <Volume className="h-4 w-4 mr-2" />
                  Exercises
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="chat"
              className="flex-1 flex flex-col px-4 py-3 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="mt-0.5 h-8 w-8 mr-2 bg-primary/20">
                        <MessageCircle className="h-4 w-4 text-primary" />
                      </Avatar>
                    )}

                    <div
                      className={`rounded-lg p-3 max-w-[75%] break-words ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      {message.sender === "ai" && message.suggestedResponses && (
                        <div className="mt-2 space-y-1.5">
                          {message.suggestedResponses.map((response, idx) => (
                            <button
                              key={idx}
                              className="text-xs bg-background text-foreground px-2 py-1 rounded-md w-full text-left hover:bg-accent transition-colors"
                              onClick={() => handleSuggestedResponse(response)}
                            >
                              {response}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.sender === "user" && (
                      <Avatar className="mt-0.5 h-8 w-8 ml-2 bg-primary">
                        <span className="text-xs text-primary-foreground">You</span>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start">
                    <Avatar className="mt-0.5 h-8 w-8 mr-2 bg-primary/20">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <span className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" />
                        <span
                          className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="flex items-center space-x-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                  <SendIcon className="h-4 w-4" />
                </Button>
              </form>

              <div className="text-xs text-center text-muted-foreground mt-2">
                <Popover>
                  <PopoverTrigger className="underline text-xs">
                    Privacy Notice
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-xs">
                    <p>
                      Your conversation is private. No data is stored after
                      closing this chat. For mental health emergencies, please
                      contact a professional or crisis helpline.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </TabsContent>

            <TabsContent
              value="resources"
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              <div>
                <h3 className="text-lg font-medium">Mental Health Resources</h3>
                <div className="mt-2 space-y-3">
                  {MENTAL_HEALTH_RESOURCES.map((resource, idx) => (
                    <div key={idx} className="border rounded-md p-3">
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary hover:underline mt-1 inline-block"
                      >
                        Learn More
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Educational Materials</h3>
                <div className="mt-2 space-y-3">
                  {Object.entries(EDUCATIONAL_CONTENT).map(
                    ([key, content], idx) => (
                      <div key={idx} className="border rounded-md p-3">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {content.content.substring(0, 120)}...
                        </p>
                        <Button
                          variant="link"
                          className="px-0 text-sm h-auto"
                          onClick={() => {
                            setActiveTab("chat");
                            handleSuggestedResponse(
                              `Tell me more about ${key}`
                            );
                          }}
                        >
                          Discuss this topic
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="exercises"
              className="flex-1 overflow-y-auto p-4 space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium">Breathing Exercises</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Breathing techniques to help reduce stress and anxiety
                </p>

                <div className="space-y-3">
                  {QUICK_BREATHING_EXERCISES.map((exercise, idx) => (
                    <div key={idx} className="border rounded-md p-3">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exercise.instructions}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exercise.benefits}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleBreathingExerciseSelect(idx)}
                      >
                        Try Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Grounding Techniques</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Quick exercises to help you reconnect with the present moment
                </p>

                <div className="space-y-3">
                  {GROUNDING_TECHNIQUES.map((technique, idx) => (
                    <div key={idx} className="border rounded-md p-3">
                      <p className="text-sm">{technique}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Journaling</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Express your thoughts through guided journaling
                </p>

                <Button
                  variant="outline"
                  onClick={handleShowJournalPrompt}
                >
                  Get a Journal Prompt
                </Button>

                {showJournalPrompt && (
                  <div className="border rounded-md p-3 mt-3 space-y-3">
                    <p className="text-sm font-medium">{journalPrompt}</p>
                    <textarea
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      className="w-full h-32 p-2 text-sm border rounded-md"
                      placeholder="Write your thoughts here..."
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveJournalEntry}
                    >
                      Save Entry
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChatCompanion;
