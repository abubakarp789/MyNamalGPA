 import { useState, useMemo } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { GraduationCap, BookOpen, Calculator, RotateCcw, Info } from "lucide-react";
 
 // HEC Pakistan Grading Scale
 const GRADES = [
   { label: "A", value: "4.00", points: 4.0 },
   { label: "A-", value: "3.67", points: 3.67 },
   { label: "B+", value: "3.33", points: 3.33 },
   { label: "B", value: "3.00", points: 3.0 },
   { label: "B-", value: "2.67", points: 2.67 },
   { label: "C+", value: "2.33", points: 2.33 },
   { label: "C", value: "2.00", points: 2.0 },
   { label: "C-", value: "1.67", points: 1.67 },
   { label: "D+", value: "1.33", points: 1.33 },
   { label: "D", value: "1.00", points: 1.0 },
   { label: "F", value: "0.00", points: 0.0 },
 ];
 
 // 7th Semester Courses
 const COURSES = [
   { code: "SS-106", name: "Iqbaliyat", credits: 2 },
   { code: "CSC-440", name: "Parallel and Distributed Computing", credits: 3 },
   { code: "CS-363", name: "Entrepreneurship", credits: 3 },
   { code: "CS-350", name: "Machine Learning", credits: 3 },
   { code: "CS-390", name: "Cyber Security", credits: 3 },
   { code: "CS-430", name: "Final Year Project I", credits: 3 },
 ];
 
 type CourseGrades = Record<string, string>;
 
 export function GPACalculator() {
   const [courseGrades, setCourseGrades] = useState<CourseGrades>({});
   const [previousCredits, setPreviousCredits] = useState<string>("");
   const [previousGPA, setPreviousGPA] = useState<string>("");
 
   const totalCredits = COURSES.reduce((sum, course) => sum + course.credits, 0);
 
   const semesterGPA = useMemo(() => {
     let totalPoints = 0;
     let totalCreditsWithGrades = 0;
 
     COURSES.forEach((course) => {
       const gradeValue = courseGrades[course.code];
       if (gradeValue) {
         const grade = GRADES.find((g) => g.value === gradeValue);
         if (grade) {
           totalPoints += grade.points * course.credits;
           totalCreditsWithGrades += course.credits;
         }
       }
     });
 
     if (totalCreditsWithGrades === 0) return null;
     return totalPoints / totalCreditsWithGrades;
   }, [courseGrades]);
 
   const cgpa = useMemo(() => {
     if (semesterGPA === null) return null;
     
     const prevCredits = parseFloat(previousCredits);
     const prevGPA = parseFloat(previousGPA);
     
     if (isNaN(prevCredits) || isNaN(prevGPA) || prevCredits <= 0) {
       return semesterGPA;
     }
     
     const totalPrevPoints = prevGPA * prevCredits;
     const currentCredits = COURSES.reduce((sum, course) => {
       return courseGrades[course.code] ? sum + course.credits : sum;
     }, 0);
     const currentPoints = semesterGPA * currentCredits;
     
     return (totalPrevPoints + currentPoints) / (prevCredits + currentCredits);
   }, [semesterGPA, previousCredits, previousGPA, courseGrades]);
 
   const handleGradeChange = (courseCode: string, value: string) => {
     setCourseGrades((prev) => ({ ...prev, [courseCode]: value }));
   };
 
   const handleReset = () => {
     setCourseGrades({});
     setPreviousCredits("");
     setPreviousGPA("");
   };
 
   const gradedCoursesCount = Object.keys(courseGrades).length;
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
         <div className="container mx-auto max-w-4xl">
           <div className="flex items-center gap-3">
             <GraduationCap className="h-10 w-10" />
             <div>
               <h1 className="text-2xl md:text-3xl font-bold">Namal University</h1>
               <p className="text-primary-foreground/80 text-sm md:text-base">
                 GPA & CGPA Calculator - BS Computer Science
               </p>
             </div>
           </div>
         </div>
       </header>
 
       <main className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
         {/* GPA Display Card */}
         <Card className="border-2 border-primary/20 shadow-xl">
           <CardContent className="pt-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
               <div className="p-4 rounded-lg bg-secondary">
                 <p className="text-sm text-muted-foreground font-medium">Total Credits</p>
                 <p className="text-3xl font-bold text-primary">{totalCredits}</p>
               </div>
               <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                 <p className="text-sm opacity-90 font-medium">Semester GPA</p>
                 <p className="text-4xl font-bold">
                   {semesterGPA !== null ? semesterGPA.toFixed(2) : "—"}
                 </p>
               </div>
               <div className="p-4 rounded-lg bg-secondary">
                 <p className="text-sm text-muted-foreground font-medium">CGPA</p>
                 <p className="text-3xl font-bold text-primary">
                   {cgpa !== null ? cgpa.toFixed(2) : "—"}
                 </p>
               </div>
             </div>
           </CardContent>
         </Card>
 
         <Tabs defaultValue="courses" className="space-y-4">
           <TabsList className="grid w-full grid-cols-3">
             <TabsTrigger value="courses" className="gap-2">
               <BookOpen className="h-4 w-4" />
               <span className="hidden sm:inline">Courses</span>
             </TabsTrigger>
             <TabsTrigger value="cgpa" className="gap-2">
               <Calculator className="h-4 w-4" />
               <span className="hidden sm:inline">CGPA</span>
             </TabsTrigger>
             <TabsTrigger value="scale" className="gap-2">
               <Info className="h-4 w-4" />
               <span className="hidden sm:inline">Grade Scale</span>
             </TabsTrigger>
           </TabsList>
 
           {/* Courses Tab */}
           <TabsContent value="courses" className="space-y-4">
             <div className="flex items-center justify-between">
               <p className="text-sm text-muted-foreground">
                 {gradedCoursesCount} of {COURSES.length} courses graded
               </p>
               <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                 <RotateCcw className="h-4 w-4" />
                 Reset All
               </Button>
             </div>
 
             <div className="grid gap-4">
               {COURSES.map((course) => (
                 <Card key={course.code} className="transition-all hover:shadow-md">
                   <CardContent className="p-4">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex-1">
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                             {course.code}
                           </span>
                           <span className="text-xs text-muted-foreground">
                             {course.credits} CH
                           </span>
                         </div>
                         <h3 className="font-semibold mt-1">{course.name}</h3>
                       </div>
                       <div className="w-full sm:w-40">
                         <Select
                           value={courseGrades[course.code] || ""}
                           onValueChange={(value) => handleGradeChange(course.code, value)}
                         >
                           <SelectTrigger>
                             <SelectValue placeholder="Select Grade" />
                           </SelectTrigger>
                           <SelectContent>
                             {GRADES.map((grade) => (
                               <SelectItem key={grade.value} value={grade.value}>
                                 {grade.label} ({grade.points.toFixed(2)})
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </TabsContent>
 
           {/* CGPA Tab */}
           <TabsContent value="cgpa">
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Previous Semesters</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-sm text-muted-foreground">
                   Enter your previous semesters' total credit hours and GPA to calculate your cumulative CGPA.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="prevCredits">Total Credits Earned</Label>
                     <Input
                       id="prevCredits"
                       type="number"
                       placeholder="e.g., 102"
                       value={previousCredits}
                       onChange={(e) => setPreviousCredits(e.target.value)}
                       min="0"
                       max="200"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="prevGPA">Previous CGPA</Label>
                     <Input
                       id="prevGPA"
                       type="number"
                       placeholder="e.g., 3.45"
                       value={previousGPA}
                       onChange={(e) => setPreviousGPA(e.target.value)}
                       min="0"
                       max="4"
                       step="0.01"
                     />
                   </div>
                 </div>
                 {previousCredits && previousGPA && semesterGPA !== null && (
                   <div className="mt-4 p-4 bg-secondary rounded-lg">
                     <p className="text-sm text-muted-foreground">
                       With {previousCredits} previous credits at {previousGPA} GPA and current semester performance:
                     </p>
                     <p className="text-2xl font-bold text-primary mt-2">
                       New CGPA: {cgpa?.toFixed(2)}
                     </p>
                   </div>
                 )}
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Grade Scale Tab */}
           <TabsContent value="scale">
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Pakistani HEC Grading Scale</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                   {GRADES.map((grade) => (
                     <div
                       key={grade.value}
                       className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                     >
                       <span className="font-bold text-primary">{grade.label}</span>
                       <span className="text-muted-foreground">{grade.points.toFixed(2)}</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
 
         {/* Footer */}
         <footer className="text-center text-sm text-muted-foreground pt-6 pb-4">
           <p>7th Semester • BS Computer Science • Namal University</p>
         </footer>
       </main>
     </div>
   );
 }