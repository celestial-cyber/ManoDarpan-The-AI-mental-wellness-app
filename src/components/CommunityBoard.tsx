
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";

// Mock community posts
const initialPosts = [
  {
    id: 1,
    content: "Today was tough, but I made it through. Small victories.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      "❤️": 5,
      "👍": 3,
      "🙏": 2,
    }
  },
  {
    id: 2,
    content: "I've been practicing mindfulness for two weeks now and already feel more centered. Anyone else have a similar experience?",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    reactions: {
      "❤️": 8,
      "👍": 6,
      "✨": 4,
    }
  },
  {
    id: 3,
    content: "Feeling anxious about an upcoming presentation. Any tips?",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reactions: {
      "❤️": 2,
      "🙏": 7,
      "🫂": 5,
    }
  }
];

// Available reaction emojis
const availableReactions = ["❤️", "👍", "🙏", "✨", "🫂", "🌟"];

interface Post {
  id: number;
  content: string;
  timestamp: string;
  reactions: Record<string, number>;
}

const CommunityBoard = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return "Just now";
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPost.trim().length === 0) {
      toast({
        title: "Cannot submit empty post",
        description: "Please write something to share with the community",
        variant: "destructive"
      });
      return;
    }
    
    if (newPost.trim().length < 10) {
      toast({
        title: "Post too short",
        description: "Please write at least 10 characters",
        variant: "destructive"
      });
      return;
    }
    
    const newPostObj: Post = {
      id: Date.now(),
      content: newPost.trim(),
      timestamp: new Date().toISOString(),
      reactions: {}
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost("");
    
    toast({
      title: "Post submitted",
      description: "Your thought has been shared anonymously",
    });
  };

  const handleReaction = (postId: number, emoji: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentCount = post.reactions[emoji] || 0;
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [emoji]: currentCount + 1
          }
        };
      }
      return post;
    }));
  };

  return (
    <div className="card-calm">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Community Board</h2>
      </div>
      
      <form onSubmit={handlePostSubmit} className="mb-8">
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts anonymously..."
          className="calm-input mb-3"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Posts are anonymous and public
          </p>
          <Button type="submit">Share Thought</Button>
        </div>
      </form>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-secondary/20 border border-border rounded-lg"
          >
            <p className="mb-3">{post.content}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {availableReactions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(post.id, emoji)}
                    className="hover:bg-secondary/50 rounded-full p-1 transition-colors"
                  >
                    <span className="text-sm">{emoji} {post.reactions[emoji] || 0}</span>
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(post.timestamp)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityBoard;
