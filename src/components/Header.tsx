import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/config";
import logo from "@/assets/logo.png"; // Adjust path if needed
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img 
              src={logo} 
              alt="Raye Logo" 
              className="h-16 object-contain" 
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#explore" className="text-lg text-muted-foreground hover:text-foreground transition-colors rounded-full px-4 py-2 hover:bg-accent">
              Branches
            </a>
            <a href="/about" className="text-lg text-muted-foreground hover:text-foreground transition-colors rounded-full px-4 py-2 hover:bg-accent">
              About
            </a>
            <Button 
               
              size="default" 
              className="rounded-full text-green-500 bg-white hover:bg-green-50 hover:border-green-500 hover:text-green-500 text-lg transition-transform duration-300 transform hover:-translate-y-1" 
              asChild
            >
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know more about availability.')}`} target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="default" 
              className="rounded-full border-green-500 text-green-500 bg-white hover:bg-green-50 hover:border-green-500 hover:text-green-500 text-lg transition-transform duration-300 transform hover:-translate-y-1" 
              asChild
            >
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know more about availability.')}`} target="_blank" rel="noopener noreferrer">
                Contact
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};