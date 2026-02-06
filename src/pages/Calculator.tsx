import { GPACalculator } from "@/components/GPACalculator";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowLeft, Moon, Sun, Sparkles, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import namalLogo from "@/assets/namal-logo.png";
import { Footer } from "@/components/landing/Footer";

const CalculatorPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 md:w-80 h-40 md:h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 md:w-96 h-48 md:h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-white/[0.02] rounded-full" />
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

        {/* Back button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/80 hover:text-white hover:bg-white/10 gap-2"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="relative container mx-auto max-w-4xl px-4 pt-16 pb-12 md:pt-20 md:pb-16">
          {/* University badge */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Namal University, Mianwali</span>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-2 md:p-3 bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/30 shadow-xl">
                <img 
                  src={namalLogo} 
                  alt="Namal University Logo" 
                  className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Calculator className="h-6 w-6 md:h-8 md:w-8 text-accent" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                GPA Calculator
              </h1>
            </div>

            <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              Calculate your semester GPA and cumulative CGPA with precision using the official Pakistani HEC grading scale.
            </p>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            viewBox="0 0 1440 120" 
            className="w-full h-12 md:h-16 fill-background"
            preserveAspectRatio="none"
          >
            <path d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Calculator Content */}
      <main className="container mx-auto max-w-4xl px-4 -mt-4 md:-mt-8 relative z-10">
        <div className="bg-card rounded-2xl md:rounded-3xl shadow-xl border border-border p-4 md:p-6 lg:p-8">
          <GPACalculator />
        </div>
      </main>

      {/* Footer */}
      <div className="mt-12 md:mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default CalculatorPage;
