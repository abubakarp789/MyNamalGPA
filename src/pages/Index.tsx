import { useRef } from "react";
import { GPACalculator } from "@/components/GPACalculator";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DeviceCompatibility } from "@/components/landing/DeviceCompatibility";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onScrollToCalculator={scrollToCalculator} />
      <FeaturesSection />
      
      {/* Calculator Section */}
      <section ref={calculatorRef} className="py-16 md:py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Calculate Your GPA
            </h2>
            <p className="text-muted-foreground text-lg">
              Add your courses and grades to see your results instantly
            </p>
          </div>
          <GPACalculator />
        </div>
      </section>
      
      <DeviceCompatibility />
      <Footer />
    </div>
  );
};

export default Index;
