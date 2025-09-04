import { WHATSAPP_NUMBER } from "@/config";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-700" style={{ backgroundColor: '#363230' }}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <span className="text-xl font-bold text-white">
              <span >Raye</span> <span className="text-primary">Kam Kiraye.</span>
            </span>
            <p className="mt-2 text-sm text-gray-200">
              Why pay more for less? Stay Raye.
            </p>
          </div>
          
          <ul className="flex flex-wrap justify-center gap-6 text-sm text-gray-200">
            <li>
              <a href="#explore" className="hover:text-primary transition-colors">
                Browse Branches
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-primary transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                WhatsApp Support
              </a>
            </li>
          </ul>
          
          <div className="text-center">
            <p className="text-sm text-gray-200">
              © 2025 Raye Kam-Kiraye. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};