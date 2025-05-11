
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Volume2, Pause, Play } from "lucide-react";

// Mock data for breathing exercises
const breathingExercises = [
  {
    id: 1,
    name: "Box Breathing",
    description: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat for 2 minutes.",
    duration: "2 min"
  },
  {
    id: 2,
    name: "4-7-8 Breathing",
    description: "Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
    duration: "1 min"
  },
  {
    id: 3,
    name: "Breath Focus",
    description: "Inhale slowly, focusing on the sensation. Exhale completely. Repeat for 5 minutes.",
    duration: "5 min"
  }
];

// Mock data for calming sounds
const calmingSounds = [
  {
    id: 1,
    name: "Gentle Rain",
    icon: "🌧️",
    audioSrc: "#" // In a real app, this would be a link to an audio file
  },
  {
    id: 2,
    name: "Ocean Waves",
    icon: "🌊",
    audioSrc: "#"
  },
  {
    id: 3,
    name: "Forest Sounds",
    icon: "🌳",
    audioSrc: "#"
  },
  {
    id: 4,
    name: "Meditation Bell",
    icon: "🔔",
    audioSrc: "#"
  }
];

// Mock data for motivational quotes
const motivationalQuotes = [
  {
    id: 1,
    quote: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  },
  {
    id: 2,
    quote: "Mental health problems don't define who you are. They are something you experience.",
    author: "Unknown"
  },
  {
    id: 3,
    quote: "Self-care is how you take your power back.",
    author: "Lalah Delia"
  },
  {
    id: 4,
    quote: "There is hope, even when your brain tells you there isn't.",
    author: "John Green"
  },
  {
    id: 5,
    quote: "You are not your illness. You have an individual story to tell.",
    author: "Unknown"
  }
];

const WellnessToolkit = () => {
  const [activeSoundId, setActiveSoundId] = useState<number | null>(null);
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [currentQuote, setCurrentQuote] = useState(0);

  const handleSoundToggle = (id: number) => {
    if (activeSoundId === id) {
      setActiveSoundId(null);
    } else {
      setActiveSoundId(id);
    }
  };

  const handleExerciseStart = (id: number) => {
    setActiveExercise(id);
    // In a real app, this would trigger a guided breathing animation
  };

  const handleNextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
  };

  return (
    <div className="card-calm">
      <h2 className="text-2xl font-bold mb-6">Wellness Toolkit</h2>
      
      <Tabs defaultValue="breathing" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
          <TabsTrigger value="sounds">Calming Sounds</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breathing" className="space-y-4">
          {breathingExercises.map((exercise) => (
            <motion.div 
              key={exercise.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg border ${
                activeExercise === exercise.id 
                  ? "bg-calm-light border-primary" 
                  : "bg-secondary/30 border-border"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{exercise.name}</h3>
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {exercise.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {exercise.description}
              </p>
              <Button 
                size="sm" 
                onClick={() => handleExerciseStart(exercise.id)}
                variant={activeExercise === exercise.id ? "default" : "outline"}
              >
                {activeExercise === exercise.id ? "Stop" : "Start"}
              </Button>
            </motion.div>
          ))}
        </TabsContent>
        
        <TabsContent value="sounds" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {calmingSounds.map((sound) => (
            <motion.button
              key={sound.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSoundToggle(sound.id)}
              className={`p-4 rounded-lg border flex flex-col items-center justify-center h-28 ${
                activeSoundId === sound.id 
                  ? "bg-calm-light border-primary" 
                  : "bg-secondary/30 border-border"
              }`}
            >
              <span className="text-3xl mb-2">{sound.icon}</span>
              <p className="text-sm font-medium">{sound.name}</p>
              <div className="mt-2">
                {activeSoundId === sound.id ? (
                  <Pause className="h-5 w-5 text-primary" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </div>
            </motion.button>
          ))}
        </TabsContent>
        
        <TabsContent value="quotes">
          <motion.div 
            key={currentQuote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-calm-light dark:bg-accent/30 p-6 rounded-lg text-center"
          >
            <p className="text-lg italic">"{motivationalQuotes[currentQuote].quote}"</p>
            <p className="mt-4 text-sm font-medium">— {motivationalQuotes[currentQuote].author}</p>
          </motion.div>
          
          <div className="flex justify-center mt-6">
            <Button onClick={handleNextQuote}>Next Quote</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WellnessToolkit;
