
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { HeartHandshake } from "lucide-react";
import JournalingPrompts from "./JournalingPrompts";

interface MoodFormProps {
  onSubmit: (entry: string) => void;
  isLoading: boolean;
}

const MoodForm = ({ onSubmit, isLoading }: MoodFormProps) => {
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");
  const [showDistressAlert, setShowDistressAlert] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");

  // Simple sentiment analysis to detect distress words
  useEffect(() => {
    const distressWords = [
      "suicid", "kill myself", "end my life", "don't want to live", 
      "better off dead", "no reason to live", "want to die", "harm myself",
      "hurt myself", "hopeless", "worthless", "can't go on", "never get better"
    ];
    
    const entryLower = entry.toLowerCase();
    const hasDistressWords = distressWords.some(word => entryLower.includes(word));
    
    setShowDistressAlert(hasDistressWords);
    
    // Basic emotion detection for journaling prompts
    if (entry.length > 5) {
      const anxietyWords = ["anxious", "nervous", "worry", "stress", "tense", "panic"];
      const sadnessWords = ["sad", "down", "depress", "lonely", "grief", "despair"];
      const happinessWords = ["happy", "joy", "excite", "content", "great", "love", "wonderful"];
      
      if (anxietyWords.some(word => entryLower.includes(word))) {
        setCurrentEmotion("anxiety");
      } else if (sadnessWords.some(word => entryLower.includes(word))) {
        setCurrentEmotion("sadness");
      } else if (happinessWords.some(word => entryLower.includes(word))) {
        setCurrentEmotion("happiness");
      } else {
        setCurrentEmotion("neutral");
      }
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (entry.trim().length < 3) {
      setError("Please share a bit more about how you're feeling");
      return;
    }
    
    setError("");
    onSubmit(entry);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {entry.length > 0 && (
        <JournalingPrompts currentEmotion={currentEmotion} />
      )}
      
      {showDistressAlert && (
        <Alert variant="destructive" className="bg-destructive/20 border-destructive/50">
          <HeartHandshake className="h-4 w-4" />
          <AlertTitle>You're not alone</AlertTitle>
          <AlertDescription>
            It sounds like you're going through a difficult time. Please consider reaching out for help.
            If you're in crisis, please call the Suicide Prevention Lifeline at 988 or text HOME to 741741 to reach the Crisis Text Line.
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <Textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Express how you're feeling today... What's on your mind?"
          className="calm-input min-h-[150px]"
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
      
      <Button 
        type="submit" 
        className="calm-button w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </div>
        ) : (
          "Check My Mood"
        )}
      </Button>
    </motion.form>
  );
};

export default MoodForm;
