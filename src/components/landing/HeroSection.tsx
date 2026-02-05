import { ArrowRight, Sparkles } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { useTheme } from "@/components/ThemeProvider";
 import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import namalLogo from "@/assets/namal-logo.png";
 
export function HeroSection() {
   const { theme, toggleTheme } = useTheme();
 
   return (
     <section className="relative hero-gradient text-white overflow-hidden min-h-[100svh] flex flex-col">
       {/* Background decoration */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-20 -right-20 w-40 md:w-80 h-40 md:h-80 bg-white/5 rounded-full blur-3xl" />
         <div className="absolute -bottom-20 -left-20 w-48 md:w-96 h-48 md:h-96 bg-accent/10 rounded-full blur-3xl" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-white/[0.02] rounded-full" />
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
 
       <div className="relative container mx-auto max-w-5xl px-4 py-8 sm:py-12 md:py-16 lg:py-20 flex-1 flex flex-col justify-center">
         {/* University badge */}
         <div className="flex justify-center mb-4 md:mb-6">
           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-2">
             <Sparkles className="h-4 w-4 text-accent" />
             <span className="text-xs md:text-sm font-medium">Namal University, Mianwali</span>
           </div>
         </div>
 
         {/* Main content */}
         <div className="text-center space-y-4 md:space-y-5">
           <div className="flex justify-center">
            <div className="p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/20 shadow-xl">
              <img 
                src={namalLogo} 
                alt="Namal University Logo" 
                className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain"
              />
             </div>
           </div>
 
           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="block">Namal University</span>
            <span className="block text-accent mt-1 md:mt-2">GPA Calculator</span>
           </h1>
 
           <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2">
            Calculate your semester GPA and cumulative CGPA using the official Pakistani HEC grading scale. 
            Designed specifically for Namal University students.
           </p>
 
           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 md:pt-4">
             <Button
               size="lg"
              asChild
               className="bg-accent text-accent-foreground hover:bg-accent/90 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-xl shadow-lg shadow-accent/25"
             >
              <Link to="/calculator">
                Start Calculating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
             </Button>
           </div>
         </div>
 
         {/* Stats */}
         <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mt-8 md:mt-12 lg:mt-16 max-w-md md:max-w-xl lg:max-w-2xl mx-auto">
           <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/10">
             <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-accent">4.0</p>
             <p className="text-xs md:text-sm text-white/70 mt-1">Max GPA</p>
           </div>
           <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/10">
             <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">HEC</p>
             <p className="text-xs md:text-sm text-white/70 mt-1">Grade Scale</p>
           </div>
           <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/10">
             <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-accent">100%</p>
             <p className="text-xs md:text-sm text-white/70 mt-1">Free Forever</p>
           </div>
         </div>
       </div>
 
       {/* Wave decoration */}
       <div className="relative mt-auto">
         <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
           <path 
             d="M0 80L60 73C120 66 240 53 360 46C480 40 600 40 720 43C840 46 960 53 1080 56C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" 
             className="fill-background"
           />
         </svg>
       </div>
     </section>
   );
 }