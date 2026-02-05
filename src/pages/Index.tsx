import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DeviceCompatibility } from "@/components/landing/DeviceCompatibility";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <DeviceCompatibility />
      <Footer />
    </div>
  );
};

export default Index;
