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
      substance: /addict|alcohol|drunk|drinking|drug|substance|using|sober|recovery|relapse|high|withdrawal|dependency|habit|coping mechanism|self-medication/i
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
      
      // Select strategies most relevant to the user's context and topics
      const relevantStrategies = strategies
        .sort(() => 0.5 - Math.random()) // Shuffle strategies
        .slice(0, 2); // Take 2 random strategies
      
      // Build a multi-part emotionally intelligent response that mirrors user language
      responseText = `${emotionResponse} ${specificReference}${validationPhrase}\n\nWould you like to try one of these approaches that others have found helpful when dealing with similar feelings?\n\n• ${relevantStrategies.join("\n• ")}\n\nOr we can continue talking about what's on your mind. What feels right to you?`;
      
      // Personalized suggested responses based on user's context
      suggestedResponses = [
        "I'll try one of those strategies", 
        "Can you tell me why this might help?",
        "I need something different",
        "Let's keep talking instead"
      ];
    }
    // For joy/positive emotions - celebrate and build on positivity
    else if (emotionDetected === "joy") {
      category = "support";
      
      const joyResponses = EMOTIONAL_RESPONSES.joy;
      const joyResponse = joyResponses[Math.floor(Math.random() * joyResponses.length)]
        .replace("{context}", updatedContext.context);
      
      // For positive emotions, focus on savoring and building on them
      const reflectionQuestions = [
        `What specifically about ${updatedContext.context} brings you the most joy?`,
        `How might you carry this positive feeling into other parts of your life?`,
        `What does this happiness around ${updatedContext.context} tell you about what matters to you?`,
        `If you could bottle this feeling, what would you label it?`
      ];
      
      // Reference something specific from their message
      let specificReference = "";
      if (keywords.length > 0) {
        specificReference = `I notice how ${keywords[0]} seems to be an important part of this positive experience. `;
      }
      
      const randomQuestion = reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];
      
      responseText = `${joyResponse} ${specificReference}Positive emotions like this are worth savoring and understanding. ${randomQuestion}`;
      
      suggest
