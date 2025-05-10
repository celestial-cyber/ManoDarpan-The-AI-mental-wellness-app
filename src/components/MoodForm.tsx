
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface MoodFormProps {
  onSubmit: (entry: string) => void;
  isLoading: boolean;
}

const MoodForm = ({ onSubmit, isLoading }: MoodFormProps) => {
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");

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
