
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string, username?: string) => void;
}

const AuthForm = ({ isLogin, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const validateUsername = (value: string) => {
    setUsernameError("");
    
    if (!value && !isLogin) {
      setUsernameError("Username is required");
      return false;
    }
    
    if (!isLogin && value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    
    if (!isLogin && value.length > 20) {
      setUsernameError("Username must be less than 20 characters");
      return false;
    }
    
    if (!isLogin && !/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUsernameError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (!isLogin && !validateUsername(username)) {
      return;
    }
    
    onSubmit(email, password, !isLogin ? username : undefined);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateUsername(e.target.value);
              }}
              className="calm-input"
              required={!isLogin}
            />
            {usernameError && (
              <div className="text-sm font-medium text-destructive">
                {usernameError}
              </div>
            )}
          </div>
        )}
        
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
