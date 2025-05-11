
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

// Mapping of emotions to relevant journaling prompts
const promptsByEmotion: Record<string, string[]> = {
  "anxiety": [
    "What's one thing that's making you anxious today?",
    "What helps you feel safe when you're anxious?",
    "What would you tell a friend who's feeling the same way?",
    "What's one small step you could take today to address your worry?"
  ],
  "stress": [
    "What are your biggest stressors right now?",
    "Which parts of your stress can you control, and which can't you?",
    "When was the last time you felt truly relaxed?",
    "What's one boundary you could set to reduce your stress?"
  ],
  "sadness": [
    "What's weighing on your heart today?",
    "When did you start feeling this way?",
    "What's one small thing that brings you joy, even when you're sad?",
    "If your sadness could speak, what might it be trying to tell you?"
  ],
  "happiness": [
    "What's bringing you joy right now?",
    "How can you extend this good feeling?",
    "What are you grateful for today?",
    "How could you share your positive energy with someone else?"
  ],
  "neutral": [
    "What's on your mind today?",
    "How would you describe your current state of being?",
    "What would make today more meaningful for you?",
    "What's one thing you're looking forward to?"
  ],
  "contentment": [
    "What's bringing you peace right now?",
    "How can you cultivate more moments like this?",
    "What's one thing you appreciate about your life today?",
    "How does contentment feel in your body?"
  ]
};

// Default prompts when no specific emotion is detected
const defaultPrompts = [
  "How are you feeling today?",
  "What's one thing you'd like to accomplish today?",
  "What's something you're grateful for?",
  "What's something you're looking forward to?",
  "What's something that challenged you recently?"
];

interface JournalingPromptsProps {
  currentEmotion?: string;
}

const JournalingPrompts = ({ currentEmotion = "neutral" }: JournalingPromptsProps) => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [displayedPromptIndex, setDisplayedPromptIndex] = useState(0);

  useEffect(() => {
    // Match emotion to appropriate prompts
    let matchedEmotion = "neutral";
    
    // Normalize the current emotion and find best match
    const normalizedEmotion = currentEmotion.toLowerCase();
    
    for (const emotion of Object.keys(promptsByEmotion)) {
      if (normalizedEmotion.includes(emotion)) {
        matchedEmotion = emotion;
        break;
      }
    }
    
    // Get prompts for the matched emotion or use defaults
    const relevantPrompts = promptsByEmotion[matchedEmotion] || defaultPrompts;
    
    // Shuffle the prompts
    const shuffledPrompts = [...relevantPrompts].sort(() => Math.random() - 0.5);
    
    setPrompts(shuffledPrompts);
    setDisplayedPromptIndex(0);
  }, [currentEmotion]);

  const handleNextPrompt = () => {
    setDisplayedPromptIndex((prev) => (prev + 1) % prompts.length);
  };

  if (prompts.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-calm-peach/40 dark:bg-accent/30 rounded-lg p-5 border border-border"
    >
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Journaling Prompt</h3>
      </div>
      
      <motion.p 
        key={displayedPromptIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg mb-4"
      >
        {prompts[displayedPromptIndex]}
      </motion.p>
      
      <Button variant="outline" size="sm" onClick={handleNextPrompt}>
        Try Another Prompt
      </Button>
    </motion.div>
  );
};

export default JournalingPrompts;
