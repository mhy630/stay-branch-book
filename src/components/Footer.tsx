import { WHATSAPP_NUMBER } from "@/config";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-heading font-bold">
                <span className="text-primary">Raye</span> <span className="text-foreground">Kam-Kiraye</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Affordable accommodation across our branches. Quality stays at budget-friendly prices.
            </p>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#explore" className="text-muted-foreground hover:text-foreground transition-colors">Browse Branches</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">WhatsApp Support</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Raye Kam-Kiraye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};