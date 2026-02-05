 import { Calculator, TrendingUp, Download, Share2, Smartphone, Monitor } from "lucide-react";
 import { Card, CardContent } from "@/components/ui/card";
 
 const features = [
   {
     icon: Calculator,
     title: "Accurate Calculations",
     description: "Uses the official Pakistani HEC grading scale for precise GPA and CGPA calculations."
   },
   {
     icon: TrendingUp,
     title: "Track Progress",
     description: "Visualize your academic journey with interactive GPA trend charts."
   },
   {
     icon: Download,
     title: "Export to PDF",
     description: "Download your results as a professional PDF document for your records."
   },
   {
     icon: Share2,
     title: "Share Results",
     description: "Generate shareable links to show your GPA to advisors or family."
   },
   {
     icon: Smartphone,
     title: "Mobile Friendly",
     description: "Works perfectly on phones, tablets, and desktops - calculate anywhere."
   },
   {
     icon: Monitor,
     title: "Dark Mode",
     description: "Easy on the eyes with automatic dark mode support."
   }
 ];
 
 export function FeaturesSection() {
   return (
    <section className="py-10 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
             Everything You Need
           </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
             A complete toolkit for managing your academic performance
           </p>
         </div>
 
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
           {features.map((feature, index) => (
             <Card 
               key={index} 
               className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30"
             >
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                 </div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-foreground mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed hidden sm:block">{feature.description}</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     </section>
   );
 }