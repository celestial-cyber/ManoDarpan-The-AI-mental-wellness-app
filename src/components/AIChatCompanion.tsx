
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
  const { toast } = useToast();

  const analyzeMessage = (message: string): {
    emotionDetected: string;
    severity: "mild" | "moderate" | "severe";
    topics: string[];
    keywords: string[];
  } => {
    // Improved analysis that looks for specific keywords
    const lowerCase = message.toLowerCase();
    const words = lowerCase.split(/\s+/);
    
    // Detect emotion with more nuanced understanding
    let emotionDetected = "neutral";
    if (/anxious|worry|stress|panic|afraid|fear|nervous|tense|uneasy/.test(lowerCase)) {
      emotionDetected = "anxiety";
    } else if (/sad|depress|down|unhappy|miserable|hopeless|blue|gloomy|lost|empty/.test(lowerCase)) {
      emotionDetected = "sadness";
    } else if (/angry|furious|mad|upset|irritate|frustrat|rage|hate|annoyed/.test(lowerCase)) {
      emotionDetected = "anger";
    } else if (/overwhelm|too much|cannot cope|can't handle|exhausted|burnout|tired|drained/.test(lowerCase)) {
      emotionDetected = "overwhelm";
    } else if (/happy|joy|excited|great|good|wonderful|fantastic|amazing|positive/.test(lowerCase)) {
      emotionDetected = "joy";
    }
    
    // Detect severity (more comprehensive heuristic)
    let severity: "mild" | "moderate" | "severe" = "mild";
    const intensifiers = ["very", "extremely", "really", "so", "too", "incredibly", "terribly", "absolutely", "completely", "totally"];
    const severeTerms = ["suicid", "kill myself", "end my life", "don't want to live", "hurt myself", "harming myself", "self-harm", "die", "death"];
    
    if (severeTerms.some(term => lowerCase.includes(term))) {
      severity = "severe";
    } else if (intensifiers.some(term => lowerCase.includes(term)) || 
              (emotionDetected !== "neutral" && lowerCase.match(new RegExp(emotionDetected, "g"))?.length > 1)) {
      severity = "moderate";
    }
    
    // Detect topics - expanded list
    const topics = [];
    if (/work|job|boss|colleague|career|profession|workplace|unemploy|coworker/.test(lowerCase)) topics.push("work");
    if (/relationship|partner|spouse|boyfriend|girlfriend|dating|marriage|love|divorce|breakup/.test(lowerCase)) topics.push("relationships");
    if (/family|parent|child|sibling|mother|father|son|daughter|brother|sister/.test(lowerCase)) topics.push("family");
    if (/health|sick|illness|disease|pain|doctor|hospital|medication|symptom|diagnosis/.test(lowerCase)) topics.push("health");
    if (/money|financial|debt|afford|expensive|bills|payment|income|saving|budget/.test(lowerCase)) topics.push("finances");
    if (/school|college|university|study|exam|homework|grade|professor|student|class/.test(lowerCase)) topics.push("education");
    if (/friend|social|lonely|alone|isolat|connection|community|belong/.test(lowerCase)) topics.push("social");
    
    // Extract specific keywords for more contextual responses
    const keywords = words.filter(word => 
      word.length > 3 && 
      !["that", "this", "then", "than", "with", "would", "could", "should", "have", "what", "when"].includes(word)
    );
    
    return {
      emotionDetected,
      severity,
      topics: topics.length ? topics : ["general"],
      keywords: keywords.slice(0, 5) // Take top 5 meaningful keywords
    };
  };

  // This function creates a more personalized response based on what the user said
  const getAIResponse = (userMessage: string): Message => {
    const analysis = analyzeMessage(userMessage);
    const { emotionDetected, severity, topics, keywords } = analysis;
    
    // Determine response category
    let category: "support" | "coping" | "education" | "referral" = "support";
    let responseText = "";
    let suggestedResponses: string[] = [];
    
    // Handle severe cases with referral
    if (severity === "severe") {
      category = "referral";
      responseText = "I'm concerned about what you're sharing. It sounds like you're going through a really difficult time. " +
        "I think it would be helpful to talk to a mental health professional who can provide proper support. " +
        "Would you like me to share some resources where you can get immediate help?";
      suggestedResponses = ["Yes, please share resources", "I'm not ready for that yet", "How can I cope right now?"];
    } 
    // For moderate cases, provide coping strategies tailored to their specific situation
    else if (severity === "moderate") {
      category = "coping";
      const strategies = COPING_STRATEGIES[emotionDetected as keyof typeof COPING_STRATEGIES] || COPING_STRATEGIES.anxiety;
      const randomStrategies = strategies.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      let topicSpecificResponse = "";
      if (topics.includes("work")) {
        topicSpecificResponse = "work situation";
      } else if (topics.includes("relationships")) {
        topicSpecificResponse = "relationship challenges";
      } else if (topics.includes("family")) {
        topicSpecificResponse = "family situation";
      } else if (topics.includes("health")) {
        topicSpecificResponse = "health concerns";
      } else if (topics.includes("finances")) {
        topicSpecificResponse = "financial pressures";
      } else if (topics.includes("education")) {
        topicSpecificResponse = "academic stress";
      } else if (topics.includes("social")) {
        topicSpecificResponse = "social challenges";
      } else {
        topicSpecificResponse = "what you're going through";
      }
      
      responseText = `I understand that you're feeling ${emotionDetected !== "neutral" ? emotionDetected : "upset"} about your ${topicSpecificResponse}. ` +
        `Here are a couple of strategies that might help:\n\n• ${randomStrategies.join("\n• ")}\n\nWould you like to try one of these, or would you prefer to talk more about how you're feeling?`;
      
      // Tailor suggested responses to their situation
      suggestedResponses = [
        "Tell me more strategies", 
        `Can you help me with my ${topics[0] || "situation"}?`,
        "Why do these strategies work?"
      ];
    }
    // For joy/positive emotions
    else if (emotionDetected === "joy") {
      category = "support";
      const positiveResponses = [
        `That's wonderful to hear! What's contributing to your positive feelings today?`,
        `I'm so glad you're feeling good! What activities have been helping you maintain this positive state?`,
        `It's great that you're feeling this way! Would you like to talk about how to maintain these positive feelings?`
      ];
      responseText = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
      suggestedResponses = ["Share what's working for me", "How to maintain this mood", "I'd like to help others feel this way"];
    }
    // For mild cases or neutral emotions, provide educational content or supportive response
    else {
      // Decide if we should be educational or just supportive based on their message
      if (userMessage.includes("?") || userMessage.toLowerCase().includes("what") || userMessage.toLowerCase().includes("how") || 
          userMessage.toLowerCase().includes("why") || userMessage.toLowerCase().includes("learn") || userMessage.toLowerCase().includes("understand")) {
        category = "education";
        let content;
        
        // Try to match their question with educational content
        if (emotionDetected !== "neutral" && EDUCATIONAL_CONTENT[emotionDetected as keyof typeof EDUCATIONAL_CONTENT]) {
          content = EDUCATIONAL_CONTENT[emotionDetected as keyof typeof EDUCATIONAL_CONTENT];
          responseText = `It sounds like you're interested in learning about ${emotionDetected}. ${content.content.substring(0, 150)}... Would you like to know more?`;
        } else {
          // Generic educational response
          responseText = `That's an interesting question. I can provide information on topics like anxiety, depression, stress, or coping strategies. What specifically would you like to learn more about?`;
        }
        
        suggestedResponses = ["Tell me about coping strategies", "I'd like to understand my emotions better", "How can I improve my mental health?"];
      } else {
        category = "support";
        // Extract what they shared to personalize response
        const topicMentioned = topics[0] !== "general" ? topics[0] : (keywords.length > 0 ? keywords[0] : "that");
        
        const supportResponses = [
          `Thank you for sharing about your ${topicMentioned}. How long have you been feeling this way?`,
          `I appreciate you opening up. What do you think triggered these feelings about ${topicMentioned}?`,
          `I'm here to listen. Would it help to talk more specifically about your ${topicMentioned}?`,
          `That sounds challenging. What has helped you cope with similar feelings about ${topicMentioned} in the past?`
        ];
        responseText = supportResponses[Math.floor(Math.random() * supportResponses.length)];
        
        // Generate suggested responses based on their message
        suggestedResponses = [
          "I'm not sure how to explain", 
          `It started when...`, 
          `Can you suggest something for my ${topicMentioned}?`
        ];
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
