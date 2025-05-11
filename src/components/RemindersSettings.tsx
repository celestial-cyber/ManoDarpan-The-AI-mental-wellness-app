
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

const RemindersSettings = () => {
  const [enableReminders, setEnableReminders] = useState(false);
  const [checkInTime, setCheckInTime] = useState("18:00");
  const [journalTime, setJournalTime] = useState("20:00");
  const [notifyMissed, setNotifyMissed] = useState(true);
  const { toast } = useToast();

  const handleSaveReminders = () => {
    // In a real app, this would store the settings in a backend
    // For now, we'll just show a toast notification
    
    const savedSettings = {
      enabled: enableReminders,
      checkInTime,
      journalTime,
      notifyMissed
    };
    
    console.log("Saved reminder settings:", savedSettings);
    
    toast({
      title: "Reminders updated",
      description: enableReminders 
        ? "Your reminder settings have been saved" 
        : "Reminders have been disabled",
    });
  };

  // Generate time options for select
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const time = `${formattedHour}:${formattedMinute}`;
        const displayTime = new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], { 
          hour: "numeric", 
          minute: "2-digit" 
        });
        options.push({ value: time, label: displayTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="card-calm">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Reminders</h2>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enable-reminders" className="text-base font-medium">Enable Gentle Reminders</Label>
            <p className="text-sm text-muted-foreground">Receive reminders for check-ins and journaling</p>
          </div>
          <Switch 
            id="enable-reminders" 
            checked={enableReminders} 
            onCheckedChange={setEnableReminders}
          />
        </div>
        
        {enableReminders && (
          <>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="check-in-time" className="text-sm font-medium mb-1 block">
                  Daily Check-in Reminder
                </Label>
                <Select 
                  value={checkInTime} 
                  onValueChange={setCheckInTime} 
                  disabled={!enableReminders}
                >
                  <SelectTrigger id="check-in-time" className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="journal-time" className="text-sm font-medium mb-1 block">
                  Journal Reminder
                </Label>
                <Select 
                  value={journalTime} 
                  onValueChange={setJournalTime} 
                  disabled={!enableReminders}
                >
                  <SelectTrigger id="journal-time" className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="missed-checkins" className="text-sm font-medium">Missed Check-ins</Label>
                <p className="text-xs text-muted-foreground">Remind after 48 hours without check-in</p>
              </div>
              <Switch 
                id="missed-checkins" 
                checked={notifyMissed} 
                onCheckedChange={setNotifyMissed}
                disabled={!enableReminders}
              />
            </div>
          </>
        )}
        
        <Button 
          onClick={handleSaveReminders} 
          className="w-full"
        >
          Save Reminder Settings
        </Button>
      </div>
    </div>
  );
};

export default RemindersSettings;
