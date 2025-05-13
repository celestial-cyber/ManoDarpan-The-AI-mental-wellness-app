import { useState, useEffect } from "react";
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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
      suggestedResponses: ["I'm feeling anxious", "I feel sad today", "I'm angry", "I'm feeling overwhelmed"],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userMoodContext, setUserMoodContext] = useState<{
    primaryEmotion: string;
    context: string;
    intensity: number;
    frequentTopics: string[];
    conversationStage: "initial" | "exploring" | "coping" | "reflection" | "closing";
  }>({
    primaryEmotion: "neutral",
    context: "",
    intensity: 0,
    frequentTopics: [],
    conversationStage: "initial"
  });
  const { toast } = useToast();

  // Improved emotional analysis system
  const analyzeMessage = (message: string): {
    emotionDetected: string;
    severity: "mild" | "moderate" | "severe";
    topics: string[];
    keywords: string[];
    context: string;
  } => {
    const lowerCase = message.toLowerCase();
    const words = lowerCase.split(/\s+/);
    
    // Enhanced emotion detection with more nuanced patterns
    let emotionDetected = "neutral";
    const emotionPatterns = {
      anxiety: /anxious|worry|worrie|stress|panic|afraid|fear|nervous|tense|uneasy|apprehensive|dread|restless|on edge|jittery/i,
      sadness: /sad|depress|down|unhappy|miserable|hopeless|blue|gloomy|lost|empty|grief|sorrow|heartbreak|disappointed|upset|lonely|alone|isolated/i,
      anger: /angry|furious|mad|upset|irritate|frustrat|rage|hate|annoyed|resentful|bitter|hostile|outraged|fed up|ticked off|pissed|livid/i,
      overwhelm: /overwhelm|too much|cannot cope|can't handle|exhausted|burnout|tired|drained|swamped|buried|too many|excessive|unbearable|crushing/i,
      joy: /happy|joy|excited|great|good|wonderful|fantastic|amazing|positive|delighted|pleased|content|thrilled|grateful|thankful|blessed|elated/i,
      fear: /scared|terrified|frightened|horror|alarmed|panicking|petrified|threatened|insecure|vulnerable/i,
      shame: /shame|embarrassed|humiliated|guilty|regret|remorse|foolish|stupid|inadequate|unworthy|exposed/i,
      grief: /grief|mourning|loss|missing|yearning|devastated|bereft|heartbroken/i
    };
    
    // Check each emotion pattern for matches
    for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
      if (pattern.test(lowerCase)) {
        emotionDetected = emotion;
        break; // Use the first detected emotion as primary
      }
    }
    
    // Detecting severity with more comprehensive analysis
    let severity: "mild" | "moderate" | "severe" = "mild";
    const intensifiers = ["very", "extremely", "really", "so", "too", "incredibly", "terribly", "absolutely", "completely", "totally", "utterly", "deeply", "profoundly"];
    const severeTerms = ["suicid", "kill myself", "end my life", "don't want to live", "hurt myself", "harming myself", "self-harm", "die", "death", "no point", "can't go on", "not worth it", "better off without me"];
    
    // Check for severe content first
    if (severeTerms.some(term => lowerCase.includes(term))) {
      severity = "severe";
    } 
    // Then check for moderate intensity based on multiple factors
    else if (intensifiers.some(term => lowerCase.includes(term)) || 
            (emotionDetected !== "neutral" && lowerCase.match(new RegExp(emotionDetected, "g"))?.length > 1) ||
            message.includes("!") || 
            /\b(always|never|every time|constantly|all the time)\b/i.test(lowerCase)) {
      severity = "moderate";
    }
    
    // Enhanced topic detection with more categories
    const topicPatterns = {
      work: /work|job|boss|colleague|career|profession|workplace|unemploy|coworker|fired|layoff|promotion|office|business|client|deadline|project/i,
      relationships: /relationship|partner|spouse|boyfriend|girlfriend|dating|marriage|love|divorce|breakup|ex|romantic|affair|cheating|dating app|single|commitment/i,
      family: /family|parent|child|sibling|mother|father|son|daughter|brother|sister|grandparent|in-law|relative|mom|dad|kid/i,
      health: /health|sick|illness|disease|pain|doctor|hospital|medication|symptom|diagnosis|chronic|condition|treatment|surgery|recovery|disability/i,
      finances: /money|financial|debt|afford|expensive|bills|payment|income|saving|budget|loan|mortgage|rent|cost|price|spend|bank|credit/i,
      education: /school|college|university|study|exam|homework|grade|professor|student|class|course|degree|assignment|teacher|learning|education/i,
      social: /friend|social|lonely|alone|isolat|connection|community|belong|rejection|acceptance|party|gathering|socializing|group|club|peer/i,
      identity: /identity|who I am|purpose|meaning|self-worth|value|belonging|fitting in|different|outsider|authentic|true self|gender|sexuality|cultural/i,
      future: /future|plan|goal|dream|aspiration|direction|purpose|vision|next step|career path|life path|uncertainty|decision|crossroads|choice/i,
      past: /past|childhood|history|trauma|memory|remember|used to|before|previous|regret|mistake|former|earlier|younger|background/i,
      selfEsteem: /confidence|self-esteem|worth|value|failure|success|achievement|comparison|not good enough|inadequate|proud|disappointed in myself|body image/i
    };
    
    const topics = [];
    for (const [topic, pattern] of Object.entries(topicPatterns)) {
      if (pattern.test(lowerCase)) {
        topics.push(topic);
      }
    }
    
    // Extract context more intelligently
    let context = "";
    
    // Look for phrases after emotion words
    const emotionWords = ["feel", "feeling", "felt", "am", "experiencing", "going through"];
    for (const word of emotionWords) {
      const match = message.match(new RegExp(`${word}\\s+(.*?)\\s+(?:about|because|due to|from|with|when|after|by|over|regarding|concerning|since|for)\\s+(.*?)(?:\\.|\\?|\\!|$)`, "i"));
      if (match) {
        context = match[2].trim();
        break;
      }
    }
    
    // If no context found, look for phrases after "because", "due to", etc.
    if (!context) {
      const contextPatterns = [
        /(?:because|due to|from|as|since)\s+(.*?)(?:\.|\?|\!|$)/i,
        /(?:about|regarding|concerning|over|with)\s+(.*?)(?:\.|\?|\!|$)/i,
        /(?:when|after|during|while)\s+(.*?)(?:\.|\?|\!|$)/i
      ];
      
      for (const pattern of contextPatterns) {
        const match = message.match(pattern);
        if (match) {
          context = match[1].trim();
          break;
        }
      }
    }
    
    // If still no context, just use the topics or keywords
    if (!context && topics.length > 0) {
      context = `your ${topics[0]}`;
    }
    
    // Extract more meaningful keywords for better contextual understanding
    const stopWords = new Set(["that", "this", "then", "than", "with", "would", "could", "should", "have", "what", "when", "where", "why", "how", "like", "just", "very", "really", "much", "many", "some", "other", "such", "from", "about", "been"]);
    const keywords = words.filter(word => 
      word.length > 3 && 
      !stopWords.has(word) &&
      !/^[0-9]+$/.test(word) // filter out pure numbers
    );
    
    return {
      emotionDetected,
      severity,
      topics: topics.length ? topics : ["general"],
      keywords: keywords.slice(0, 5), // Take top 5 meaningful keywords
      context: context || "what you're experiencing" // Fallback if no context detected
    };
  };

  // Advanced response generation system with emotional intelligence
  const getAIResponse = (userMessage: string): Message => {
    const analysis = analyzeMessage(userMessage);
    const { emotionDetected, severity, topics, keywords, context } = analysis;
    
    // Update user mood context to maintain continuity in the conversation
    const updatedMoodContext = {
      primaryEmotion: emotionDetected,
      context: context,
      intensity: severity === "severe" ? 8 : severity === "moderate" ? 5 : 3,
      frequentTopics: [...userMoodContext.frequentTopics],
      conversationStage: userMoodContext.conversationStage
    };
    
    // Add new topics to frequent topics if not already present
    topics.forEach(topic => {
      if (!updatedMoodContext.frequentTopics.includes(topic)) {
        updatedMoodContext.frequentTopics.push(topic);
      }
    });
    
    // Keep only the 3 most recent topics
    if (updatedMoodContext.frequentTopics.length > 3) {
      updatedMoodContext.frequentTopics = updatedMoodContext.frequentTopics.slice(-3);
    }
    
    // Progress the conversation stage
    if (updatedMoodContext.conversationStage === "initial") {
      updatedMoodContext.conversationStage = "exploring";
    } else if (updatedMoodContext.conversationStage === "exploring" && messages.length > 3) {
      updatedMoodContext.conversationStage = "coping";
    } else if (updatedMoodContext.conversationStage === "coping" && messages.length > 6) {
      updatedMoodContext.conversationStage = "reflection";
    } else if (updatedMoodContext.conversationStage === "reflection" && messages.length > 9) {
      updatedMoodContext.conversationStage = "closing";
    }
    
    // Set the updated mood context
    setUserMoodContext(updatedMoodContext);
    
    // Determine response category and compose emotionally intelligent response
    let category: "support" | "coping" | "education" | "referral" = "support";
    let responseText = "";
    let suggestedResponses: string[] = [];
    
    // Handle severe cases with referral - crisis priority
    if (severity === "severe") {
      category = "referral";
      
      // Personalized empathetic crisis response
      const emotionPhrase = emotionDetected !== "neutral" ? 
        `It sounds like you're experiencing intense ${emotionDetected}` : 
        "I'm hearing that you're going through something really difficult";
        
      responseText = `${emotionPhrase} right now. I'm genuinely concerned about your wellbeing and your safety matters. ` +
        `This kind of emotional pain can feel overwhelming, and you deserve immediate support from someone specially trained to help. ` +
        `Would you be open to reaching out to one of these crisis resources where compassionate people are available 24/7? ` +
        `They're experienced in helping people navigate exactly these kinds of intense feelings.`;
        
      suggestedResponses = [
        "Yes, I'd like to see those resources", 
        "I'm not ready for that yet", 
        "What else can help me right now?",
        "Can you just listen for a bit longer?"
      ];
    } 
    // For moderate cases, provide empathetic response with coping options
    else if (severity === "moderate" || updatedMoodContext.conversationStage === "coping") {
      category = "coping";
      
      // Get emotional validation and coping strategies
      const emotionResponses = EMOTIONAL_RESPONSES[emotionDetected as keyof typeof EMOTIONAL_RESPONSES] || EMOTIONAL_RESPONSES.neutral;
      const validationPhrases = VALIDATION_PHRASES;
      
      // Select response templates and personalize them
      const emotionResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)].replace("{context}", context);
      const validationPhrase = validationPhrases[Math.floor(Math.random() * validationPhrases.length)]
        .replace("{context}", context)
        .replace("{emotion}", emotionDetected);
      
      // Get appropriate coping strategies
      const strategies = COPING_STRATEGIES[emotionDetected as keyof typeof COPING_STRATEGIES] || COPING_STRATEGIES.anxiety;
      const randomStrategies = strategies.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      // Build a multi-part emotionally intelligent response
      responseText = `${emotionResponse} ${validationPhrase}\n\nWould you like to try one of these approaches that others have found helpful when dealing with similar feelings?\n\n• ${randomStrategies.join("\n• ")}\n\nOr we can continue talking about what's on your mind. What feels right to you?`;
      
      // Personalized suggested responses
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
      const joyResponse = joyResponses[Math.floor(Math.random() * joyResponses.length)].replace("{context}", context);
      
      const reflectionQuestions = [
        `What specifically about ${context} brings you the most joy?`,
        `How might you carry this positive feeling into other parts of your life?`,
        `What does this happiness around ${context} tell you about what matters to you?`,
        `If you could bottle this feeling, what would you label it?`
      ];
      
      const randomQuestion = reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];
      
      responseText = `${joyResponse} Positive emotions like this are worth savoring and understanding. ${randomQuestion}`;
      
      suggestedResponses = [
        "It makes me happy because...", 
        "I want to feel this way more often",
        "This matters to me because...",
        "I've noticed a pattern with my happiness"
      ];
    }
    // For educational/reflection phase or when questions are asked
    else if (userMessage.includes("?") || 
             userMoodContext.conversationStage === "reflection" ||
             /what|how|why|explain|understand|learn|tell me about/i.test(userMessage)) {
      
      category = "education";
      
      // Check if we should provide specific educational content
      if (emotionDetected !== "neutral" && EDUCATIONAL_CONTENT[emotionDetected as keyof typeof EDUCATIONAL_CONTENT]) {
        const content = EDUCATIONAL_CONTENT[emotionDetected as keyof typeof EDUCATIONAL_CONTENT];
        
        // Create an informative but warm educational response
        responseText = `I appreciate your curiosity about ${emotionDetected}. ${content.content.substring(0, 200)}... \n\nUnderstanding our emotions can help us manage them more effectively. Would you like to know more about this, or perhaps explore how it relates to your specific situation?`;
      } else {
        // Create a thoughtful reflection question based on their context
        const reflectionQuestion = REFLECTION_QUESTIONS[Math.floor(Math.random() * REFLECTION_QUESTIONS.length)].replace("{context}", context);
        
        responseText = `Thank you for sharing and reflecting with me. Understanding our emotions can give us important insights. ${reflectionQuestion}`;
      }
      
      suggestedResponses = [
        "That's an interesting question...", 
        "I'd like to understand more about my feelings",
        "How do most people handle this?",
        "Can you share some research on this?"
      ];
    }
    // For general supportive responses - active listening and validation
    else {
      category = "support";
      
      // Get appropriate emotional response template
      const emotionResponses = EMOTIONAL_RESPONSES[emotionDetected as keyof typeof EMOTIONAL_RESPONSES] || EMOTIONAL_RESPONSES.neutral;
      const emotionResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)].replace("{context}", context);
      
      // Add a personalized follow-up question
      let followUpQuestion = "";
      const personalQuestions = [
        `How long have you been feeling this way about ${context}?`,
        `What do you think triggered these feelings about ${context}?`,
        `How does this situation with ${context} impact your daily life?`,
        `What would feeling better about ${context} look like for you?`,
        `Is there something specific about ${context} that feels most challenging?`
      ];
      
      followUpQuestion = personalQuestions[Math.floor(Math.random() * personalQuestions.length)];
      
      responseText = `${emotionResponse} ${followUpQuestion}`;
      
      // Dynamic suggested responses based on the question asked
      if (followUpQuestion.includes("how long")) {
        suggestedResponses = ["It just started recently", "It's been going on for a while", "It comes and goes", "This is an ongoing issue"];
      } else if (followUpQuestion.includes("triggered")) {
        suggestedResponses = ["It started when...", "I'm not sure what caused it", "There was a specific event", "It's a combination of things"];
      } else if (followUpQuestion.includes("impact")) {
        suggestedResponses = ["It affects my sleep", "It's hard to focus", "It changes how I interact with others", "I feel it physically"];
      } else if (followUpQuestion.includes("feeling better")) {
        suggestedResponses = ["I just want peace of mind", "I need practical solutions", "I want to understand why I feel this way", "I'm not sure what would help"];
      } else {
        suggestedResponses = ["Yes, specifically...", "I'm not sure what to say", "Can you help me figure that out?", "I have a few thoughts about that"];
      }
    }
    
    return {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: "ai",
      timestamp: new Date(),
      category,
      suggestedResponses,
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Show typing indicator
    setIsTyping(true);
    
    // Generate AI response after a delay
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage.text);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedResponseClick = (response: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Generate AI response after a delay
    setTimeout(() => {
      const aiResponse = getAIResponse(response);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (isOpen) {
      // Scroll to bottom of messages when new messages are added or dialog is opened
      const messagesContainer = document.getElementById("chat-messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  return (
    <>
      <Button
        variant="outline"
        className="fixed bottom-6 left-6 z-50 bg-primary hover:bg-primary-700 text-primary-foreground rounded-full shadow-lg h-12 w-12 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Chat with AI Companion</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <div className="bg-primary text-primary-foreground flex items-center justify-center h-full rounded-full">M</div>
                </Avatar>
                Mano - Mental Health Companion
              </DialogTitle>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">About this chatbot</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">About Mental Health Support</h4>
                    <p className="text-sm text-muted-foreground">
                      This chatbot is designed to provide supportive responses and resources, but is not a substitute for professional mental health care. In case of emergency, please contact a mental health professional or crisis hotline.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <DialogDescription className="text-xs mt-1">
              I'm here to listen and support you through difficult times.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden pt-2">
              <div id="chat-messages-container" className="flex-1 overflow-y-auto px-4 py-2">
                <div className="space-y-4">
                  <p className="text-xs text-center text-muted-foreground border-b pb-2">
                    I'm here to listen and provide support, but I'm not a replacement for professional mental health care.
                  </p>
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                        
                        {message.sender === "ai" && message.suggestedResponses && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.suggestedResponses.map((response, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestedResponseClick(response)}
                                className="text-xs bg-background/80 hover:bg-background px-2 py-1 rounded-full text-foreground"
                              >
                                {response}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-secondary">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-foreground/70 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-foreground/70 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-foreground/70 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                    <SendIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="flex-1 overflow-y-auto px-4 py-2">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Book className="h-4 w-4" />
                    Mental Health Resources
                  </h3>
                  <div className="space-y-3">
                    {MENTAL_HEALTH_RESOURCES.map((resource, i) => (
                      <div key={i} className="bg-card rounded-lg p-3 border">
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary hover:underline mt-1 inline-block"
                        >
                          Learn more
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Volume className="h-4 w-4" />
                    Quick Coping Techniques
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-card rounded-lg p-3 border">
                      <h4 className="font-medium">4-7-8 Breathing</h4>
                      <p className="text-sm">Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.</p>
                    </div>
                    
                    <div className="bg-card rounded-lg p-3 border">
                      <h4 className="font-medium">5-4-3-2-1 Grounding</h4>
                      <p className="text-sm">Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.</p>
                    </div>
                    
                    <div className="bg-card rounded-lg p-3 border">
                      <h4 className="font-medium">Body Scan</h4>
                      <p className="text-sm">Starting at your toes and moving up to your head, notice any tension and consciously relax each part of your body.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChatCompanion;
