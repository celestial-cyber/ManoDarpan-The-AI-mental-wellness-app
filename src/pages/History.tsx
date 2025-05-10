
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
import EmotionTrendChart from "../components/EmotionTrendChart";

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

  useEffect(() => {
    // Fetch mood history from localStorage
    // In a real app, this would come from a database
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
          <h1 className="text-3xl font-bold mb-6">Your Mood History</h1>
          
          {loading ? (
            <div className="card-calm p-8 text-center">
              <p className="text-muted-foreground">Loading your mood history...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="card-calm p-8 text-center">
              <h2 className="text-xl font-medium mb-2">No entries yet</h2>
              <p className="text-muted-foreground">Your mood check-ins will appear here once you've created some.</p>
            </div>
          ) : (
            <>
              {/* Emotion Trend Chart */}
              <div className="card-calm mb-6">
                <h2 className="text-xl font-semibold mb-4">Emotional Trends</h2>
                <EmotionTrendChart data={entries} />
              </div>
            
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
