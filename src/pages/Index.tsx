
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "../components/AuthForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // This would normally connect to a backend authentication service
  // For this demo we'll just navigate to the home page
  const handleAuth = (email: string, password: string) => {
    console.log("Auth attempt with:", email, password);
    // For demo purposes, any login/signup is successful
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-calm-gray to-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-calm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">MindCheck</h1>
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
