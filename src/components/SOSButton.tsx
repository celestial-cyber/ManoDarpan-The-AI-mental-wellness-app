
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const sendAlert = () => {
    // Mock function to send alert to trusted contact
    toast({
      title: "Alert sent",
      description: "Your trusted contact has been notified",
    });
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 text-white border-none rounded-full shadow-lg h-16 w-16 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <ShieldAlert className="h-8 w-8" />
        <span className="sr-only">SOS</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Crisis Support</DialogTitle>
            <DialogDescription className="text-center">
              We're here to help you through this difficult moment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-semibold">National Crisis Helpline</h3>
              <p className="text-lg font-medium">1800-599-0019</p>
              <p className="text-xs text-muted-foreground">Available 24/7</p>
            </div>
            
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-semibold">Mental Health Emergency</h3>
              <p className="text-lg font-medium">108</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Notify your trusted contact</h3>
              <Button onClick={sendAlert} className="w-full">
                Send Alert to Trusted Contact
              </Button>
            </div>
          </div>
          <DialogFooter className="flex justify-center">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
