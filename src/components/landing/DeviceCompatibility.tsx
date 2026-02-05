 import { Smartphone, Tablet, Monitor, Check } from "lucide-react";
 import { Card, CardContent } from "@/components/ui/card";
 
 const devices = [
   {
     icon: Smartphone,
     name: "Mobile Phones",
     description: "iPhone, Android, and all modern smartphones",
     features: ["Touch-optimized interface", "Responsive layouts", "Add to home screen"]
   },
   {
     icon: Tablet,
     name: "Tablets",
     description: "iPad, Android tablets, and hybrid devices",
     features: ["Optimized for larger screens", "Side-by-side viewing", "Landscape support"]
   },
   {
     icon: Monitor,
     name: "Desktop & Laptop",
     description: "Windows, Mac, Linux, and Chromebooks",
     features: ["Full feature access", "Keyboard shortcuts", "Wide display support"]
   }
 ];
 
 export function DeviceCompatibility() {
   return (
    <section className="py-10 md:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
             Works on All Your Devices
           </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
             Access your GPA calculator from anywhere, on any device. No app downloads required.
           </p>
         </div>
 
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
           {devices.map((device, index) => (
             <Card key={index} className="bg-card border-border/50">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <device.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
                 </div>
                <h3 className="font-semibold text-xs sm:text-sm md:text-lg text-foreground mb-1 md:mb-2">{device.name}</h3>
                <p className="text-muted-foreground text-xs mb-2 md:mb-4 hidden sm:block">{device.description}</p>
                <ul className="space-y-1 md:space-y-2 hidden md:block">
                   {device.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                       {feature}
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
           ))}
         </div>
 
        <div className="mt-6 md:mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 md:px-6 md:py-3">
            <Check className="h-4 w-4 md:h-5 md:w-5" />
            <span className="font-medium text-xs md:text-sm lg:text-base">100% Browser-Based • No Installation</span>
           </div>
         </div>
       </div>
     </section>
   );
 }