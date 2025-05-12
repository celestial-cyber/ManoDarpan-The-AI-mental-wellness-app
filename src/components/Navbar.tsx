
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, History as HistoryIcon, User, LayoutDashboard, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname]); // Re-check when route changes

  const menuItems = [
    { name: "Check-in", path: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "History", path: "/history", icon: <HistoryIcon className="h-5 w-5" /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
  ];
  
  const handleLogout = () => {
    // In a real app with Supabase, you would call supabase.auth.signOut()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    
    // Clear localStorage items that contain user data
    localStorage.removeItem("currentUser");
    
    // Redirect to login page
    navigate("/");
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">Manodarpan</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 mr-4">
              {menuItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium relative flex items-center",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-foreground hover:bg-secondary transition-colors"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </div>
            
            {user && (
              <div className="flex items-center gap-3 ml-4">
                <div className="text-sm">
                  <span className="font-medium">@{user.username || user.name?.split(' ')[0].toLowerCase()}</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-destructive" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-background border-b border-border pb-3"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-base font-medium flex items-center",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary transition-colors"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {user && (
              <div className="flex items-center justify-between px-3 py-2 mt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    @{user.username || user.name?.split(' ')[0].toLowerCase()}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
