
import { useState, useEffect } from "react";
import { Shield, Save, BookHeadphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PrivateNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load notes from localStorage
    const storedNotes = localStorage.getItem("privateTherapyNotes");
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        // Convert date strings back to Date objects
        const hydratedNotes = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(hydratedNotes);
      } catch (error) {
        console.error("Error parsing stored notes:", error);
        toast({
          title: "Error loading notes",
          description: "There was a problem loading your notes. Some data may be lost.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  useEffect(() => {
    // Save notes to localStorage whenever they change
    if (notes.length > 0) {
      localStorage.setItem("privateTherapyNotes", JSON.stringify(notes));
    }
  }, [notes]);

  const createNewNote = () => {
    setCurrentNote(null);
    setTitle("");
    setContent("");
  };

  const selectNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const saveNote = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();
    
    if (currentNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === currentNote.id 
          ? { ...note, title, content, updatedAt: now } 
          : note
      ));
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: now,
        updatedAt: now
      };
      setNotes([newNote, ...notes]);
      setCurrentNote(newNote);
    }

    toast({
      title: "Note saved",
      description: "Your private note has been securely saved."
    });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (currentNote && currentNote.id === id) {
      createNewNote();
    }
    toast({
      title: "Note deleted",
      description: "Your note has been permanently deleted."
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Notes List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Private Notes
          </CardTitle>
          <CardDescription>
            Your secure therapy and reflection notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            className="w-full mb-4"
            onClick={createNewNote}
          >
            + New Note
          </Button>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">
                No notes yet. Create your first note!
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-md cursor-pointer ${
                    currentNote?.id === note.id
                      ? "bg-secondary"
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => selectNote(note)}
                >
                  <div className="font-medium truncate">{note.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Note Editor */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookHeadphones className="h-5 w-5" />
            {currentNote ? "Edit Note" : "New Note"}
          </CardTitle>
          <CardDescription>
            Your notes are stored securely and privately
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your private thoughts, therapy reflections..."
              className="min-h-[200px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentNote && (
            <Button
              variant="outline"
              onClick={() => deleteNote(currentNote.id)}
            >
              Delete
            </Button>
          )}
          <Button 
            onClick={saveNote}
            disabled={!title.trim()}
            className="ml-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Note
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PrivateNotes;
