import { Heart } from "lucide-react";
import namalLogo from "@/assets/namal-logo.png";
 
 export function Footer() {
   return (
     <footer className="py-8 bg-card border-t border-border">
       <div className="container mx-auto max-w-5xl px-4">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-2">
            <img src={namalLogo} alt="Namal Logo" className="h-8 w-8 object-contain" />
             <span className="font-semibold text-foreground">Namal GPA Calculator</span>
           </div>
           
           <p className="text-sm text-muted-foreground flex items-center gap-1">
             Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for Namal University students
           </p>
           
           <p className="text-sm text-muted-foreground">
             © {new Date().getFullYear()} • HEC Pakistan Grading Scale
           </p>
         </div>
       </div>
     </footer>
   );
 }