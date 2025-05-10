
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface MoodResultProps {
  result: {
    emotion: string;
    analysis: string;
    advice: string;
  };
  entry: string;
  onReset: () => void;
}

const MoodResult = ({ result, entry, onReset }: MoodResultProps) => {
  // Determine suggested actions based on emotion
  const getSuggestedActions = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "anxiety":
      case "stress":
        return [
          { title: "Breathing Exercise", link: "#" },
          { title: "Journaling Prompts", link: "#" }
        ];
      case "sadness":
      case "depression":
        return [
          { title: "Self-care Activities", link: "#" },
          { title: "Gratitude Practice", link: "#" }
        ];
      case "joy":
      case "happiness":
      case "contentment":
        return [
          { title: "Capture the Moment", link: "#" },
          { title: "Share Your Joy", link: "#" }
        ];
      default:
        return [
          { title: "Mindfulness Break", link: "#" },
          { title: "Reflection Questions", link: "#" }
        ];
    }
  };

  const suggestedActions = getSuggestedActions(result.emotion);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-calm-light dark:bg-accent/30 p-4 rounded-xl mb-6">
        <p className="text-sm text-muted-foreground mb-2">You wrote:</p>
        <p className="italic text-foreground">{entry}</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-xl font-medium text-primary mb-2">I sense you're feeling:</h3>
          <p className="text-2xl font-semibold">{result.emotion}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-primary mb-2">Analysis:</h3>
          <p className="text-foreground">{result.analysis}</p>
        </div>
        
        <div className="bg-calm-blue/30 dark:bg-calm-blue/20 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-primary mb-2">Suggestion:</h3>
          <p className="text-foreground">{result.advice}</p>
        </div>
        
        <div className="pt-2">
          <h3 className="text-lg font-medium text-primary mb-3">Try these activities:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedActions.map((action, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="justify-between hover:bg-accent/50 transition-all duration-300 group"
              >
                {action.title}
                <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      
      <div className="pt-6">
        <Button
          onClick={onReset}
          className="calm-button-secondary w-full"
        >
          New Check-in
        </Button>
      </div>
    </motion.div>
  );
};

export default MoodResult;
