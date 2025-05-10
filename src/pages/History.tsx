
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CheckIn {
  id: number;
  date: string;
  entry: string;
  result: {
    emotion: string;
    analysis: string;
    advice: string;
  };
}

const History = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to get user's history
    const loadHistory = () => {
      setIsLoading(true);
      try {
        const history = JSON.parse(localStorage.getItem("moodHistory") || "[]");
        setCheckIns(history);
      } catch (error) {
        console.error("Error loading history:", error);
        setCheckIns([]);
      }
      setIsLoading(false);
    };

    loadHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  };

  const getEmotionColor = (emotion: string) => {
    const emotions: Record<string, string> = {
      "Joy": "bg-green-100 text-green-800",
      "Sadness": "bg-blue-100 text-blue-800",
      "Anxiety": "bg-amber-100 text-amber-800",
      "Anger": "bg-red-100 text-red-800",
      "Contemplative": "bg-purple-100 text-purple-800"
    };
    
    return emotions[emotion] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-calm-gray">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Your Check-in History</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Check-ins List */}
            <div className="md:col-span-1">
              <div className="card-calm h-full">
                <h2 className="text-xl font-semibold mb-4">Past Check-ins</h2>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : checkIns.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {checkIns.map((checkIn) => (
                      <motion.button
                        key={checkIn.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedCheckIn(checkIn)}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          selectedCheckIn?.id === checkIn.id
                            ? "bg-calm-blue border border-calm-blue"
                            : "bg-white border border-calm-light hover:bg-calm-light/50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(checkIn.date)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getEmotionColor(checkIn.result.emotion)}`}>
                            {checkIn.result.emotion}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">
                          {checkIn.entry}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No check-ins yet</p>
                    <Button 
                      onClick={() => window.location.href = "/home"}
                      variant="link" 
                      className="mt-2"
                    >
                      Create your first check-in
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Check-in Details */}
            <div className="md:col-span-2">
              <div className="card-calm h-full">
                {selectedCheckIn ? (
                  <motion.div
                    key={selectedCheckIn.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Check-in Details</h2>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(selectedCheckIn.date)}
                        </span>
                      </div>
                      
                      <div className="bg-calm-light p-4 rounded-xl mb-6">
                        <p className="text-sm text-muted-foreground mb-2">You wrote:</p>
                        <p className="italic text-foreground">{selectedCheckIn.entry}</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-primary mb-2">Emotion:</h3>
                          <div className="inline-block">
                            <span className={`px-3 py-1 rounded-full ${getEmotionColor(selectedCheckIn.result.emotion)}`}>
                              {selectedCheckIn.result.emotion}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-primary mb-2">Analysis:</h3>
                          <p className="text-foreground">{selectedCheckIn.result.analysis}</p>
                        </div>
                        
                        <div className="bg-calm-blue/30 p-6 rounded-xl">
                          <h3 className="text-lg font-medium text-primary mb-2">Suggestion:</h3>
                          <p className="text-foreground">{selectedCheckIn.result.advice}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p className="mt-4 text-center">Select a check-in to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
