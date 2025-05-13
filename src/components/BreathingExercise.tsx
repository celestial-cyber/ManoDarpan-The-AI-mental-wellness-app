
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BreathingExerciseProps {
  name: string;
  instructions: string;
  inhaleTime?: number;  // seconds
  holdTime?: number;    // seconds
  exhaleTime?: number;  // seconds
  repetitions?: number;
  onComplete: () => void;
}

const BreathingExercise = ({
  name,
  instructions,
  inhaleTime = 4,
  holdTime = 4,
  exhaleTime = 4,
  repetitions = 5,
  onComplete
}: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest");
  const [currentRep, setCurrentRep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Start the exercise
  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase("inhale");
    setCurrentRep(1);
    setTimeLeft(inhaleTime);
  };
  
  // Stop the exercise
  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase("rest");
    setCurrentRep(0);
  };

  // Exercise logic
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      if (timeLeft > 1) {
        setTimeLeft(prev => prev - 1);
      } else {
        // Transition to next phase
        if (currentPhase === "inhale") {
          setCurrentPhase("hold");
          setTimeLeft(holdTime);
        } else if (currentPhase === "hold") {
          setCurrentPhase("exhale");
          setTimeLeft(exhaleTime);
        } else if (currentPhase === "exhale") {
          // If completed all repetitions, end exercise
          if (currentRep >= repetitions) {
            setIsActive(false);
            setCurrentPhase("rest");
            onComplete();
          } else {
            // Start next rep
            setCurrentRep(prev => prev + 1);
            setCurrentPhase("inhale");
            setTimeLeft(inhaleTime);
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, currentPhase, timeLeft, currentRep, inhaleTime, holdTime, exhaleTime, repetitions, onComplete]);
  
  // Animation for the breathing circle
  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: inhaleTime, ease: "easeInOut" }
    },
    hold: {
      scale: 1.5,
      transition: { duration: holdTime, ease: "linear" }
    },
    exhale: {
      scale: 1,
      transition: { duration: exhaleTime, ease: "easeInOut" }
    },
    rest: {
      scale: 1
    }
  };
  
  // Get instruction text based on current phase
  const getInstructionText = () => {
    if (!isActive) return "Press start when you're ready";
    
    switch (currentPhase) {
      case "inhale": return "Breathe in slowly...";
      case "hold": return "Hold your breath...";
      case "exhale": return "Breathe out slowly...";
      default: return "";
    }
  };

  // Calculate progress for the exercise
  const totalSteps = repetitions * 3; // 3 phases per repetition
  const completedSteps = 
    (currentRep - 1) * 3 + 
    (currentPhase === "inhale" ? 0 : currentPhase === "hold" ? 1 : currentPhase === "exhale" ? 2 : 0);
  const progress = isActive ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-sm text-center text-muted-foreground">{instructions}</p>
      
      <div className="relative my-8 flex items-center justify-center">
        {/* Progress ring */}
        <svg className="w-32 h-32 -rotate-90 transform">
          <circle 
            cx="64" 
            cy="64" 
            r="60" 
            stroke="currentColor" 
            strokeOpacity="0.1" 
            strokeWidth="8" 
            fill="none"
          />
          <circle 
            cx="64" 
            cy="64" 
            r="60"
            stroke="currentColor" 
            strokeWidth="8" 
            fill="none"
            strokeDasharray="376.8" // 2 * π * r
            strokeDashoffset={376.8 - (376.8 * progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Breathing circle animation */}
        <motion.div 
          className="absolute bg-background rounded-full border-2 border-primary"
          style={{ width: 100, height: 100 }}
          variants={circleVariants}
          animate={currentPhase}
        />
        
        {/* Repetition counter */}
        <div className="absolute text-sm font-medium">
          {isActive ? `${currentRep}/${repetitions}` : ""}
        </div>
      </div>
      
      <p className="text-lg font-medium">
        {getInstructionText()}
      </p>
      
      {timeLeft > 0 && isActive && (
        <p className="text-2xl font-bold">{timeLeft}</p>
      )}
      
      <div className="flex gap-2">
        {!isActive ? (
          <Button onClick={handleStart}>Start</Button>
        ) : (
          <Button variant="outline" onClick={handleStop}>Stop</Button>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
