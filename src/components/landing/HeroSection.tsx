import { ArrowRight, Sparkles } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { useTheme } from "@/components/ThemeProvider";
 import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import namalLogo from "@/assets/namal-logo.png";
 
export function HeroSection() {
   const { theme, toggleTheme } = useTheme();
 
   return (
     <section className="relative hero-gradient text-white overflow-hidden h-screen flex flex-col">
       {/* Background decoration */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-20 -right-20 w-40 md:w-80 h-40 md:h-80 bg-white/5 rounded-full blur-3xl" />
         <div className="absolute -bottom-20 -left-20 w-48 md:w-96 h-48 md:h-96 bg-accent/10 rounded-full blur-3xl" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] lg:w-[1000px] h-[600px] md:h-[800px] lg:h-[1000px] bg-white/[0.02] rounded-full" />
       </div>
 
       {/* Theme toggle */}
       <div className="absolute top-4 right-4 z-20">
         <Button
           variant="ghost"
           size="icon"
           onClick={toggleTheme}
           className="text-white/80 hover:text-white hover:bg-white/10"
         >
           {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
         </Button>
       </div>
 
       <div className="relative container mx-auto max-w-4xl px-4 flex-1 flex flex-col items-center justify-center">
         {/* University badge */}
         <div className="flex justify-center mb-6 md:mb-8">
           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 md:px-5 md:py-2.5">
             <Sparkles className="h-4 w-4 text-accent" />
             <span className="text-sm md:text-base font-medium">Namal University, Mianwali</span>
         </div>
         </div>
 
         {/* Main content */}
         <div className="text-center space-y-6 md:space-y-8">
           <div className="flex justify-center">
             <div className="p-3 md:p-4 bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/30 shadow-2xl">
               <img 
                 src={namalLogo} 
                 alt="Namal University Logo" 
                 className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain"
               />
           </div>
         </div>
 
           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
             <span className="block">Namal University</span>
             <span className="block text-accent mt-2 md:mt-3">GPA Calculator</span>
           </h1>
 
           <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-4">
             Calculate your semester GPA and cumulative CGPA using the official Pakistani HEC grading scale. 
             Designed specifically for Namal University students.
           </p>
 
           <div className="flex items-center justify-center pt-4 md:pt-6">
             <Button
               size="lg"
               asChild
               className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 rounded-xl shadow-lg shadow-accent/25 font-semibold"
             >
               <Link to="/calculator">
                 Start Calculating
                 <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
               </Link>
             </Button>
         </div>
       </div>
       </div>
     </section>
   );
 }