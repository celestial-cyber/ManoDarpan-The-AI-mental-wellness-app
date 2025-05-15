
import { useState } from "react";
import { ShieldAlert, Save, Send } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(() => {
    const savedContacts = localStorage.getItem("trustedContacts");
    return savedContacts ? JSON.parse(savedContacts) : [];
  });
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const { toast } = useToast();

  const saveContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Error",
        description: "Please enter both name and phone number",
        variant: "destructive"
      });
      return;
    }

    const contactId = Date.now().toString();
    const updatedContacts = [...trustedContacts, { ...newContact, id: contactId }];
    
    setTrustedContacts(updatedContacts);
    localStorage.setItem("trustedContacts", JSON.stringify(updatedContacts));
    
    toast({
      title: "Contact saved",
      description: `${newContact.name} has been added as a trusted contact`,
    });
    
    setNewContact({ name: "", phone: "" });
    setIsAddingContact(false);
    
    // Auto-select the new contact if it's the first one
    if (updatedContacts.length === 1) {
      setSelectedContactId(contactId);
    }
  };

  const sendAlert = () => {
    if (trustedContacts.length === 0) {
      setIsAddingContact(true);
      return;
    }
    
    if (!selectedContactId && trustedContacts.length > 1) {
      toast({
        title: "Select a contact",
        description: "Please select a trusted contact to notify",
        variant: "destructive"
      });
      return;
    }
    
    const contactToAlert = selectedContactId 
      ? trustedContacts.find(c => c.id === selectedContactId)
      : trustedContacts[0];
    
    // Mock function to send alert to trusted contact
    toast({
      title: "Alert sent",
      description: `${contactToAlert?.name} has been notified`,
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
            
            {isAddingContact ? (
              <div className="border p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">Add a Trusted Contact</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any trusted contacts yet. Add someone who can help in a crisis.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="name">Contact Name</Label>
                  <Input 
                    id="name" 
                    value={newContact.name} 
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={newContact.phone} 
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="w-1/2" onClick={() => setIsAddingContact(false)}>
                    Cancel
                  </Button>
                  <Button className="w-1/2" onClick={saveContact}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Contact
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-2">Notify your trusted contact</h3>
                {trustedContacts.length === 0 ? (
                  <Button onClick={() => setIsAddingContact(true)} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Add Trusted Contact
                  </Button>
                ) : trustedContacts.length === 1 ? (
                  <Button onClick={sendAlert} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Alert to {trustedContacts[0].name}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Select value={selectedContactId} onValueChange={setSelectedContactId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trusted contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {trustedContacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={sendAlert} 
                      className="w-full"
                      disabled={!selectedContactId}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Alert
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setIsAddingContact(true)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Another Contact
                    </Button>
                  </div>
                )}
              </div>
            )}
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
