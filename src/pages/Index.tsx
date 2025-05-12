
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "../components/AuthForm";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // This would normally connect to a backend authentication service
  // For this demo we'll simulate checking username uniqueness and authentication
  const handleAuth = async (email: string, password: string, username?: string, fullName?: string) => {
    console.log("Auth attempt with:", email, password, 
      username ? `username: ${username}` : "", 
      fullName ? `fullName: ${fullName}` : "");
    
    // Only check username during signup
    if (!isLogin && username) {
      setIsCheckingUsername(true);
      
      try {
        // Simulate checking username against Supabase
        // In a real app, this would be a Supabase query
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request
        
        // Simulate username is taken 20% of the time for demo purposes
        const isUsernameTaken = Math.random() < 0.2;
        
        if (isUsernameTaken) {
          toast({
            title: "Username already taken",
            description: "Please try another username",
            variant: "destructive",
          });
          setIsCheckingUsername(false);
          return;
        }
        
        // Username is available, proceed with signup
        console.log("Username is available:", username);
        
        // Here you would store the user data including username in Supabase
        // For this demo, simulate successful signup and store in localStorage
        localStorage.setItem("currentUser", JSON.stringify({
          email,
          username,
          name: fullName || username,
          joinDate: new Date().toLocaleDateString(),
          avatar: "",
          streak: Math.floor(Math.random() * 5) + 1, // Random streak between 1-5 for demo
        }));
        
        toast({
          title: "Account created!",
          description: `Welcome, ${fullName || username}!`,
        });
        
        navigate("/home");
      } catch (error) {
        console.error("Error checking username:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCheckingUsername(false);
      }
    } else {
      // For login, simulate successful login
      // In a real app, this would verify credentials in Supabase
      
      // For demo, simulate existing user data
      const mockUser = {
        email,
        username: email.split('@')[0], // Use part of email as username for demo login
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1), // Capitalize first letter
        joinDate: "May 2023",
        avatar: "",
        streak: Math.floor(Math.random() * 5) + 1, // Random streak between 1-5 for demo
      };
      
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      // For demo purposes, any login is successful
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-calm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Manodarpan</h1>
            <p className="text-muted-foreground">Your daily mental wellness companion</p>
          </div>
          
          <div className="flex mb-8">
            <Button
              variant={isLogin ? "default" : "outline"}
              className="flex-1 rounded-r-none"
              onClick={() => setIsLogin(true)}
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "default" : "outline"}
              className="flex-1 rounded-l-none"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>
          
          <AuthForm 
            isLogin={isLogin}
            onSubmit={handleAuth}
          />
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline focus:outline-none"
              >
                {isLogin ? "Sign up" : "Login"} 
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
