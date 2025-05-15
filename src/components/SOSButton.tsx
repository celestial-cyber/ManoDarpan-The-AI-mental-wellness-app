
import { useState } from "react";
import { ShieldAlert, Save, Send, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
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
    setIsContactSheetOpen(false);
    
    // Auto-select the new contact if it's the first one
    if (updatedContacts.length === 1) {
      setSelectedContactId(contactId);
    }
  };

  const sendAlertToContact = (contactId?: string) => {
    if (!contactId && trustedContacts.length === 0) {
      setIsAddingContact(true);
      return;
    }
    
    const contactToAlert = contactId 
      ? trustedContacts.find(c => c.id === contactId)
      : null;
    
    // Mock function to send alert to trusted contact
    toast({
      title: "Alert sent",
      description: contactToAlert 
        ? `${contactToAlert.name} has been notified` 
        : "All trusted contacts have been notified",
    });
    
    setIsOpen(false);
  };

  const sendAlertToAll = () => {
    if (trustedContacts.length === 0) {
      setIsAddingContact(true);
      return;
    }
    
    // Mock function to send alert to all trusted contacts
    toast({
      title: "Alert sent",
      description: `${trustedContacts.length} contacts have been notified`,
    });
    
    setIsOpen(false);
  };

  const openContactSheet = () => {
    setIsContactSheetOpen(true);
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
                  {trustedContacts.length === 0 
                    ? "You don't have any trusted contacts yet. Add someone who can help in a crisis."
                    : "Add another trusted contact to your emergency list."}
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
                <h3 className="font-semibold mb-2">Emergency Alert Options</h3>
                {trustedContacts.length === 0 ? (
                  <Button onClick={() => setIsAddingContact(true)} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Add Trusted Contact
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => openContactSheet()} 
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Alert to Trusted Contact
                    </Button>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-[48%]"
                        onClick={() => setIsAddingContact(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-[48%] bg-red-100 hover:bg-red-200 border-red-200"
                        onClick={sendAlertToAll}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Alert All
                      </Button>
                    </div>
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
      
      {/* Sheet for selecting contact to alert */}
      <Sheet open={isContactSheetOpen} onOpenChange={setIsContactSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select Contact to Alert</SheetTitle>
            <SheetDescription>
              Choose which trusted contact you want to send an alert to
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-4">
            {trustedContacts.map((contact) => (
              <Button 
                key={contact.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => sendAlertToContact(contact.id)}
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </Button>
            ))}
            
            <Button 
              className="w-full mt-4"
              onClick={sendAlertToAll}
            >
              <Users className="h-4 w-4 mr-2" />
              Send Alert to All Contacts
            </Button>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SOSButton;
