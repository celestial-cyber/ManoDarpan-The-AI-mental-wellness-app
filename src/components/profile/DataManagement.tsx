
import { Button } from "@/components/ui/button";
import { Download, Trash, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataManagementProps {
  moodHistory: any[];
}

const DataManagement = ({ moodHistory }: DataManagementProps) => {
  const { toast } = useToast();

  const handleDataExport = () => {
    // Create a CSV from the mood history
    const headers = ["Date", "Emotion", "Entry", "Analysis", "Advice"];
    const csvRows = [
      headers.join(','),
      ...moodHistory.map(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        const emotion = entry.result.emotion;
        const journalEntry = `"${entry.entry.replace(/"/g, '""')}"`;
        const analysis = `"${entry.result.analysis.replace(/"/g, '""')}"`;
        const advice = `"${entry.result.advice.replace(/"/g, '""')}"`;
        return [date, emotion, journalEntry, analysis, advice].join(',');
      })
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "manodarpan_mood_journal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data exported",
      description: "Your mood journal has been downloaded as a CSV file",
    });
  };
  
  const handleDataDelete = () => {
    if (confirm("Are you sure you want to delete all your mood data? This action cannot be undone.")) {
      localStorage.removeItem("moodHistory");
      
      toast({
        title: "Data deleted",
        description: "All your mood data has been permanently deleted",
        variant: "destructive"
      });
      
      // Force reload to update UI
      window.location.reload();
    }
  };

  return (
    <div className="card-calm mt-6">
      <h2 className="text-2xl font-bold mb-6">Data Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={handleDataExport}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download Mood Journal (CSV)
        </Button>
        <Button 
          variant="outline" 
          className="text-destructive hover:text-destructive flex items-center gap-2"
          onClick={handleDataDelete}
        >
          <Trash size={16} />
          Delete All Check-in Data
        </Button>
      </div>
      
      <div className="mt-6 border-t pt-6 border-border">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Shield size={16} />
          <h3 className="text-sm font-medium">Data Privacy</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          All your data is stored locally on your device and is never shared with third parties.
          You can export or delete your data at any time.
        </p>
      </div>
    </div>
  );
};

export default DataManagement;
