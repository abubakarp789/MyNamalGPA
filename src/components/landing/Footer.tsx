import { Heart } from "lucide-react";
import namalLogo from "@/assets/namal-logo.png";
 
 export function Footer() {
   return (
    <footer className="py-4 md:py-6 bg-card border-t border-border">
       <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
           <div className="flex items-center gap-2">
           <img src={namalLogo} alt="Namal Logo" className="h-6 w-6 md:h-8 md:w-8 object-contain" />
            <span className="font-semibold text-sm md:text-base text-foreground">Namal GPA Calculator</span>
           </div>
           
          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 md:h-4 md:w-4 text-destructive fill-destructive" /> for Namal students
           </p>
           
          <p className="text-xs md:text-sm text-muted-foreground">
            © {new Date().getFullYear()} • HEC Pakistan
           </p>
         </div>
       </div>
     </footer>
   );
 }