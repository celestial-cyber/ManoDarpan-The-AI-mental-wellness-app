
import { useState } from "react";
import { MessageCircle, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIChatCompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm Mano, your wellness companion. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const getAIResponse = (userMessage: string): string => {
    // This is a mock AI response system. In a real app, this would connect to an AI service
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("sad") || lowerCaseMessage.includes("depress") || lowerCaseMessage.includes("unhappy")) {
      return "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to try a quick mindfulness exercise, or perhaps journal about what's on your mind?";
    } 
    else if (lowerCaseMessage.includes("anxious") || lowerCaseMessage.includes("worry") || lowerCaseMessage.includes("stress")) {
      return "I notice you're feeling anxious. Try taking a few deep breaths - in for 4 counts, hold for 7, out for 8. Would you like me to guide you through a short grounding exercise?";
    }
    else if (lowerCaseMessage.includes("happy") || lowerCaseMessage.includes("good") || lowerCaseMessage.includes("great")) {
      return "I'm glad to hear you're doing well! It's wonderful that you're experiencing positive emotions. Would you like to reflect on what's contributing to your good mood today?";
    }
    else if (lowerCaseMessage.includes("tired") || lowerCaseMessage.includes("exhaust") || lowerCaseMessage.includes("fatigue")) {
      return "Being tired can be challenging. Have you been getting enough rest? Remember that good sleep hygiene is important for mental wellbeing. Would you like some tips for better sleep?";
    }
    else {
      return "Thank you for sharing. Remember that I'm here to listen and support you, though I'm not a replacement for professional help. How else can I assist you today?";
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Button
        variant="outline"
        className="fixed bottom-6 left-6 z-50 bg-primary hover:bg-primary-700 text-primary-foreground rounded-full shadow-lg h-12 w-12 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Chat with AI Companion</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <div className="bg-primary text-primary-foreground flex items-center justify-center h-full rounded-full">M</div>
              </Avatar>
              Mano - Your Wellness Companion
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mb-4 p-2">
            <div className="space-y-4">
              <p className="text-xs text-center text-muted-foreground border-b pb-2">
                I'm here to listen and provide support, but I'm not a replacement for professional mental health care.
              </p>
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChatCompanion;
