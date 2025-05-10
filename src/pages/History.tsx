
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmotionTrendChart from "../components/EmotionTrendChart";
import { Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  id: number;
  date: Date;
  entry: string;
  result: {
    emotion: string;
    analysis: string;
    advice: string;
  };
}

const History = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch mood history from localStorage
    const storedEntries = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    setEntries(storedEntries);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const handleDelete = (id: number) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("moodHistory", JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry deleted",
      description: "Your mood entry has been removed from history",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold">Your Mood History</h1>
            
            {entries.length > 0 && (
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="card-calm p-8 text-center">
              <p className="text-muted-foreground">Loading your mood history...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="card-calm p-8 text-center">
              <h2 className="text-xl font-medium mb-2">No entries yet</h2>
              <p className="text-muted-foreground">Your mood check-ins will appear here once you've created some.</p>
              <div className="mt-6">
                <Button onClick={() => window.location.href = "/home"}>
                  Create Your First Check-in
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="charts">
              <TabsList className="w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="charts" className="flex-1">Charts & Analytics</TabsTrigger>
                <TabsTrigger value="entries" className="flex-1">All Entries</TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts">
                {/* Emotion Trend Chart */}
                <div className="card-calm mb-6">
                  <h2 className="text-xl font-semibold mb-4">Emotional Patterns</h2>
                  <EmotionTrendChart data={entries} />
                </div>
                
                {/* Summary Statistics */}
                <div className="card-calm">
                  <h2 className="text-xl font-semibold mb-4">Summary</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Check-ins</h3>
                      <p className="text-2xl font-semibold">{entries.length}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Most Recent</h3>
                      <p className="text-xl font-semibold">{entries[0]?.result.emotion || "None"}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">First Check-in</h3>
                      <p className="text-sm">
                        {entries.length > 0 ? 
                          new Date(entries[entries.length - 1].date).toLocaleDateString() : 
                          "None"}
                      </p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Streak</h3>
                      <p className="text-2xl font-semibold">1 day</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="entries">
                {/* Entries Table */}
                <div className="card-calm overflow-hidden">
                  <h2 className="text-xl font-semibold mb-4">Check-in History</h2>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Mood</TableHead>
                          <TableHead className="hidden md:table-cell">Entry</TableHead>
                          <TableHead className="hidden lg:table-cell">Analysis</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {formatDate(entry.date.toString())}
                            </TableCell>
                            <TableCell>
                              {entry.result.emotion}
                            </TableCell>
                            <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                              {entry.entry}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                              {entry.result.analysis}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(entry.id)}
                                  title="Delete entry"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
