
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, History, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-border py-4 px-6 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="font-bold text-xl text-primary">
          MindCheck
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/home"
            className={`flex items-center space-x-2 ${
              isActive("/home")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>

          <Link
            to="/history"
            className={`flex items-center space-x-2 ${
              isActive("/history")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History size={20} />
            <span>History</span>
          </Link>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-muted-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden mt-4 pt-4 border-t"
        >
          <div className="flex flex-col space-y-4 items-center">
            <Link
              to="/home"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 py-2 px-4 w-full ${
                isActive("/home")
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link
              to="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 py-2 px-4 w-full ${
                isActive("/history")
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <History size={20} />
              <span>History</span>
            </Link>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center space-x-3 py-2 px-4 w-full text-muted-foreground justify-start"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
