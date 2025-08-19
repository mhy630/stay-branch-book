import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/config";

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <span className="text-primary-foreground font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-heading font-bold">
              <span className="text-primary">Raye</span> <span className="text-foreground">Kam-Kiraye</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Branches
            </a>
            <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Button variant="whatsapp" size="sm" asChild>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know more about availability.')}`} target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="whatsapp" size="sm" asChild>
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