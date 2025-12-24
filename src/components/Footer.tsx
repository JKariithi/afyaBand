import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/80 text-sm flex items-center gap-2">
            © 2025 AFYA BAND (GROUP 1 SPM 406). All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-health-pink fill-health-pink" /> for better health
          </p>
        </div>
      </div>
    </footer>
  );
};
