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
     <section className="py-16 md:py-24 bg-background">
       <div className="container mx-auto max-w-5xl px-4">
         <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
             Everything You Need
           </h2>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             A complete toolkit for managing your academic performance
           </p>
         </div>
 
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feature, index) => (
             <Card 
               key={index} 
               className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30"
             >
               <CardContent className="p-6">
                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                   <feature.icon className="h-6 w-6 text-primary" />
                 </div>
                 <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     </section>
   );
 }