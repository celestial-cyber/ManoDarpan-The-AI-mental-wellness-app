
import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceToTextInputProps {
  onTranscript: (text: string) => void;
}

const VoiceToTextInput = ({ onTranscript }: VoiceToTextInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join(' ');
        
        onTranscript(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast({
          title: "Error",
          description: `Microphone error: ${event.error}`,
          variant: "destructive"
        });
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Feature not available",
        description: "Your browser doesn't support voice recording.",
        variant: "destructive"
      });
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript, toast]);

  const toggleRecording = () => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your speech has been converted to text."
      });
    } else {
      recognition.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak now. Your voice will be converted to text."
      });
    }
  };

  return (
    <Button
      variant="outline"
      className={`rounded-full p-2 ${isRecording ? 'bg-red-100 text-red-600 hover:text-red-700' : ''}`}
      onClick={toggleRecording}
      type="button"
    >
      {isRecording ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
      <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
    </Button>
  );
};

export default VoiceToTextInput;
