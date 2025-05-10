
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-calm-light p-4 rounded-xl mb-6">
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
        
        <div className="bg-calm-blue/30 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-primary mb-2">Suggestion:</h3>
          <p className="text-foreground">{result.advice}</p>
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
