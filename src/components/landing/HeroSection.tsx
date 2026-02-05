import { ArrowRight, Sparkles } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { useTheme } from "@/components/ThemeProvider";
 import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import namalLogo from "@/assets/namal-logo.png";
 
export function HeroSection() {
   const { theme, toggleTheme } = useTheme();
 
   return (
     <section className="relative hero-gradient text-white overflow-hidden">
       {/* Background decoration */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
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
 
       <div className="relative container mx-auto max-w-5xl px-4 py-20 md:py-32">
         {/* University badge */}
         <div className="flex justify-center mb-8">
           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
             <Sparkles className="h-4 w-4 text-accent" />
             <span className="text-sm font-medium">Namal University, Mianwali</span>
           </div>
         </div>
 
         {/* Main content */}
         <div className="text-center space-y-6">
           <div className="flex justify-center">
            <div className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
              <img 
                src={namalLogo} 
                alt="Namal University Logo" 
                className="h-20 w-20 md:h-28 md:w-28 object-contain"
              />
             </div>
           </div>
 
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block">Namal University</span>
            <span className="block text-accent mt-2">GPA Calculator</span>
           </h1>
 
           <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Calculate your semester GPA and cumulative CGPA using the official Pakistani HEC grading scale. 
            Designed specifically for Namal University students.
           </p>
 
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Button
               size="lg"
              asChild
               className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-xl shadow-lg shadow-accent/25"
             >
              <Link to="/calculator">
                Start Calculating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
             </Button>
           </div>
         </div>
 
         {/* Stats */}
         <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 md:mt-24 max-w-2xl mx-auto">
           <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
             <p className="text-2xl md:text-3xl font-bold text-accent">4.0</p>
             <p className="text-xs md:text-sm text-white/70 mt-1">Max GPA</p>
           </div>
           <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
             <p className="text-2xl md:text-3xl font-bold text-white">HEC</p>
             <p className="text-xs md:text-sm text-white/70 mt-1">Grade Scale</p>
           </div>
           <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
             <p className="text-2xl md:text-3xl font-bold text-accent">100%</p>
             <p className="text-xs md:text-sm text-white/70 mt-1">Free Forever</p>
           </div>
         </div>
       </div>
 
       {/* Wave decoration */}
       <div className="absolute bottom-0 left-0 right-0">
         <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
           <path 
             d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
             className="fill-background"
           />
         </svg>
       </div>
     </section>
   );
 }