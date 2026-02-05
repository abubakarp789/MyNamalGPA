import { Heart, Linkedin, Github } from "lucide-react";
import namalLogo from "@/assets/namal-logo.png";
 
export function Footer() {
  return (
    <footer className="py-6 md:py-8 bg-card border-t border-border">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Logo and title */}
          <div className="flex items-center gap-2">
            <img src={namalLogo} alt="Namal Logo" className="h-8 w-8 object-contain" />
            <span className="font-semibold text-base text-foreground">Namal GPA Calculator</span>
          </div>
          
          {/* Developer credit */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> by{" "}
              <span className="font-medium text-foreground">Abu Bakar</span>
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.linkedin.com/in/abubakar56/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <span className="text-muted-foreground/50">•</span>
              <a 
                href="https://github.com/abubakarp789" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} • HEC Pakistan Grading Scale
          </p>
       </div>
      </div>
    </footer>
  );
}