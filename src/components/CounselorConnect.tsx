
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Shield } from "lucide-react";

const CounselorConnect = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setIsSubmitting(false);
      
      toast({
        title: "Request sent",
        description: "A mental health professional will contact you soon",
      });
    }, 1500);
  };

  return (
    <div className="card-calm">
      <div className="flex items-center gap-2 mb-6">
        <Phone className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Connect with a Counselor</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Fill out this form to be connected with a mental health professional who can provide guidance and support.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Your email address"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Your phone number"
          />
        </div>
        
        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea 
            id="message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Please describe what you're experiencing and how we can help"
            required
            rows={5}
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/20 p-3 rounded-md">
          <Shield className="h-4 w-4 flex-shrink-0" />
          <span>Your information is confidential and will only be shared with mental health professionals</span>
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Request Support"}
        </Button>
      </form>
    </div>
  );
};

export default CounselorConnect;
