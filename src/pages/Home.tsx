
import { useState } from "react";
import Navbar from "../components/Navbar";
import MoodForm from "../components/MoodForm";
import MoodResult from "../components/MoodResult";
import { motion } from "framer-motion";

interface MoodResultData {
  emotion: string;
  analysis: string;
  advice: string;
}

const Home = () => {
  const [moodEntry, setMoodEntry] = useState("");
  const [result, setResult] = useState<MoodResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (entry: string) => {
    setIsLoading(true);
    setMoodEntry(entry);
    
    // Simulate API call to mood analysis service
    setTimeout(() => {
      // This is where you would normally call an AI service
      // For demo purposes we'll just generate a response based on text length
      let mockResponse: MoodResultData;
      
      if (entry.toLowerCase().includes("sad") || entry.toLowerCase().includes("unhappy") || entry.toLowerCase().includes("depress")) {
        mockResponse = {
          emotion: "Sadness",
          analysis: "I notice you're feeling down today. Your words express sadness and perhaps some disappointment.",
          advice: "Take some time for self-care today. Even small acts of kindness toward yourself can help shift your perspective."
        };
      } else if (entry.toLowerCase().includes("happy") || entry.toLowerCase().includes("joy") || entry.toLowerCase().includes("great")) {
        mockResponse = {
          emotion: "Joy",
          analysis: "Your words show positivity and contentment. You seem to be in good spirits today.",
          advice: "Wonderful! Consider sharing your positive energy with others who might need it today."
        };
      } else if (entry.toLowerCase().includes("anxious") || entry.toLowerCase().includes("worry") || entry.toLowerCase().includes("stress")) {
        mockResponse = {
          emotion: "Anxiety",
          analysis: "I'm detecting some worry and tension in your words. Your mind seems to be racing with concerns.",
          advice: "Try a 5-minute breathing exercise: breathe in for 4 counts, hold for 7, exhale for 8. Repeat several times."
        };
      } else {
        mockResponse = {
          emotion: "Contemplative",
          analysis: "Your entry suggests you're in a thoughtful, reflective state today.",
          advice: "This is a good time for journaling or creative activities that allow you to explore your thoughts further."
        };
      }
      
      // Save check-in to history (would normally be stored in a database)
      const newCheckIn = {
        id: Date.now(),
        date: new Date(),
        entry: entry,
        result: mockResponse
      };
      
      // Store in localStorage for the history page to access
      const history = JSON.parse(localStorage.getItem("moodHistory") || "[]");
      localStorage.setItem("moodHistory", JSON.stringify([newCheckIn, ...history]));
      
      setResult(mockResponse);
      setIsLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setMoodEntry("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-calm-gray">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card-calm">
            <h1 className="text-3xl font-bold mb-6 text-center">How are you feeling today?</h1>
            
            {!result ? (
              <MoodForm onSubmit={handleSubmit} isLoading={isLoading} />
            ) : (
              <MoodResult 
                result={result}
                entry={moodEntry}
                onReset={handleReset} 
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
