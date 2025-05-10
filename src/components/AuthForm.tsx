
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string) => void;
}

const AuthForm = ({ isLogin, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    onSubmit(email, password);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="calm-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="calm-input"
            required
          />
        </div>
        
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="calm-input"
              required
            />
          </div>
        )}
        
        {error && (
          <div className="text-sm font-medium text-destructive mt-2">
            {error}
          </div>
        )}
        
        <Button type="submit" className="calm-button w-full mt-6">
          {isLogin ? "Login" : "Create Account"}
        </Button>
      </div>
    </motion.form>
  );
};

export default AuthForm;
