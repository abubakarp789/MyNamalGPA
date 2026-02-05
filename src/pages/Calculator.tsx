 import { GPACalculator } from "@/components/GPACalculator";
 import { Button } from "@/components/ui/button";
 import { useTheme } from "@/components/ThemeProvider";
 import { ArrowLeft, Moon, Sun } from "lucide-react";
 import { Link } from "react-router-dom";
 import namalLogo from "@/assets/namal-logo.png";
 
 const Calculator = () => {
   const { theme, toggleTheme } = useTheme();
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="bg-primary text-primary-foreground py-4 px-4 shadow-lg sticky top-0 z-50">
         <div className="container mx-auto max-w-4xl">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                 <img 
                   src={namalLogo} 
                   alt="Namal Logo" 
                   className="h-10 w-10 bg-white rounded-lg p-1 object-contain"
                 />
                 <div>
                   <h1 className="text-lg md:text-xl font-bold">GPA Calculator</h1>
                   <p className="text-primary-foreground/80 text-xs md:text-sm">
                     Namal University
                   </p>
                 </div>
               </Link>
             </div>
             <div className="flex items-center gap-2">
               <Button
                 variant="ghost"
                 size="sm"
                 asChild
                 className="text-primary-foreground hover:bg-primary-foreground/20 hidden sm:flex"
               >
                 <Link to="/">
                   <ArrowLeft className="h-4 w-4 mr-1" />
                   Back to Home
                 </Link>
               </Button>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={toggleTheme}
                 className="text-primary-foreground hover:bg-primary-foreground/20"
               >
                 {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
               </Button>
             </div>
           </div>
         </div>
       </header>
 
       {/* Calculator Content */}
       <main className="container mx-auto max-w-4xl px-4 py-8">
         <GPACalculator />
       </main>
 
       {/* Footer */}
       <footer className="py-6 bg-card border-t border-border">
         <div className="container mx-auto max-w-4xl px-4 text-center">
           <p className="text-sm text-muted-foreground">
             Pakistani HEC Grading Scale • Namal University GPA Calculator
           </p>
         </div>
       </footer>
     </div>
   );
 };
 
 export default Calculator;