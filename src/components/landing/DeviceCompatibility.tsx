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
     <section className="py-16 md:py-24 bg-secondary/30">
       <div className="container mx-auto max-w-5xl px-4">
         <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
             Works on All Your Devices
           </h2>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             Access your GPA calculator from anywhere, on any device. No app downloads required.
           </p>
         </div>
 
         <div className="grid md:grid-cols-3 gap-6">
           {devices.map((device, index) => (
             <Card key={index} className="bg-card border-border/50">
               <CardContent className="p-6 text-center">
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                   <device.icon className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="font-semibold text-xl text-foreground mb-2">{device.name}</h3>
                 <p className="text-muted-foreground text-sm mb-4">{device.description}</p>
                 <ul className="space-y-2">
                   {device.features.map((feature, idx) => (
                     <li key={idx} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                       <Check className="h-4 w-4 text-primary" />
                       {feature}
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
           ))}
         </div>
 
         <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-6 py-3">
             <Check className="h-5 w-5" />
             <span className="font-medium">100% Browser-Based • No Installation Required</span>
           </div>
         </div>
       </div>
     </section>
   );
 }