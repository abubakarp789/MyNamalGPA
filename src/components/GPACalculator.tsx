 import { useState, useMemo } from "react";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { GraduationCap, BookOpen, Calculator, RotateCcw, Info, TrendingUp, Plus, Trash2 } from "lucide-react";
 import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
 
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
 
 interface Course {
   id: string;
   name: string;
   credits: number;
 }
 
 interface Semester {
   id: string;
   name: string;
   credits: number;
   gpa: number;
 }
 
 type CourseGrades = Record<string, string>;
 
 const generateId = () => Math.random().toString(36).substr(2, 9);
 
 export function GPACalculator() {
   // Courses state
   const [courses, setCourses] = useState<Course[]>([
     { id: generateId(), name: "Course 1", credits: 3 },
   ]);
   const [newCourseName, setNewCourseName] = useState("");
   const [newCourseCredits, setNewCourseCredits] = useState("3");
   
   // Grades state
   const [courseGrades, setCourseGrades] = useState<CourseGrades>({});
   
   // Previous semesters state
   const [semesters, setSemesters] = useState<Semester[]>([]);
   const [newSemesterName, setNewSemesterName] = useState("");
   const [newSemesterCredits, setNewSemesterCredits] = useState("");
   const [newSemesterGPA, setNewSemesterGPA] = useState("");
 
   const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
 
   const semesterGPA = useMemo(() => {
     let totalPoints = 0;
     let totalCreditsWithGrades = 0;
 
     courses.forEach((course) => {
       const gradeValue = courseGrades[course.id];
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
   }, [courseGrades, courses]);
 
   const cgpa = useMemo(() => {
     if (semesterGPA === null) return null;
     
     const totalPrevCredits = semesters.reduce((sum, s) => sum + s.credits, 0);
     if (totalPrevCredits === 0) {
       return semesterGPA;
     }
     
     const totalPrevPoints = semesters.reduce((sum, s) => sum + (s.gpa * s.credits), 0);
     
     const currentCredits = courses.reduce((sum, course) => {
       return courseGrades[course.id] ? sum + course.credits : sum;
     }, 0);
     const currentPoints = semesterGPA * currentCredits;
     
     return (totalPrevPoints + currentPoints) / (totalPrevCredits + currentCredits);
   }, [semesterGPA, semesters, courseGrades, courses]);
 
   // Chart data
   const chartData = useMemo(() => {
     let cumCredits = 0;
     let cumPoints = 0;
     
     return semesters.map((sem) => {
       cumCredits += sem.credits;
       cumPoints += sem.gpa * sem.credits;
       const calculatedCgpa = cumPoints / cumCredits;
       
       return {
         name: sem.name.length > 10 ? sem.name.substring(0, 10) + "..." : sem.name,
         fullName: sem.name,
         GPA: sem.gpa,
         CGPA: parseFloat(calculatedCgpa.toFixed(2)),
       };
     });
   }, [semesters]);
 
   const handleGradeChange = (courseId: string, value: string) => {
     setCourseGrades((prev) => ({ ...prev, [courseId]: value }));
   };
 
   const addCourse = () => {
     if (!newCourseName.trim()) return;
     const credits = parseInt(newCourseCredits) || 3;
     setCourses((prev) => [...prev, { id: generateId(), name: newCourseName.trim(), credits }]);
     setNewCourseName("");
     setNewCourseCredits("3");
   };
 
   const removeCourse = (id: string) => {
     setCourses((prev) => prev.filter((c) => c.id !== id));
     setCourseGrades((prev) => {
       const updated = { ...prev };
       delete updated[id];
       return updated;
     });
   };
 
   const addSemester = () => {
     if (!newSemesterName.trim() || !newSemesterCredits || !newSemesterGPA) return;
     const credits = parseInt(newSemesterCredits) || 0;
     const gpa = parseFloat(newSemesterGPA) || 0;
     if (credits <= 0 || gpa < 0 || gpa > 4) return;
     
     setSemesters((prev) => [...prev, { 
       id: generateId(), 
       name: newSemesterName.trim(), 
       credits, 
       gpa: Math.min(4, Math.max(0, gpa))
     }]);
     setNewSemesterName("");
     setNewSemesterCredits("");
     setNewSemesterGPA("");
   };
 
   const removeSemester = (id: string) => {
     setSemesters((prev) => prev.filter((s) => s.id !== id));
   };
 
   const handleReset = () => {
     setCourseGrades({});
   };
 
   const gradedCoursesCount = Object.keys(courseGrades).length;
   const totalPreviousCredits = semesters.reduce((sum, s) => sum + s.credits, 0);
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
         <div className="container mx-auto max-w-4xl">
           <div className="flex items-center gap-3">
             <GraduationCap className="h-10 w-10" />
             <div>
               <h1 className="text-2xl md:text-3xl font-bold">GPA Calculator</h1>
               <p className="text-primary-foreground/80 text-sm md:text-base">
                 Pakistani HEC Grading Scale
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
             <TabsTrigger value="courses" className="gap-1 text-xs sm:text-sm">
               <BookOpen className="h-4 w-4" />
               <span className="hidden sm:inline">Courses</span>
             </TabsTrigger>
             <TabsTrigger value="cgpa" className="gap-1 text-xs sm:text-sm">
               <Calculator className="h-4 w-4" />
               <span className="hidden sm:inline">CGPA</span>
             </TabsTrigger>
             <TabsTrigger value="scale" className="gap-1 text-xs sm:text-sm">
               <Info className="h-4 w-4" />
               <span className="hidden sm:inline">Grade Scale</span>
             </TabsTrigger>
           </TabsList>
 
           {/* Courses Tab */}
           <TabsContent value="courses" className="space-y-4">
             <div className="flex items-center justify-between">
               <p className="text-sm text-muted-foreground">
                 {gradedCoursesCount} of {courses.length} courses graded
               </p>
               <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                 <RotateCcw className="h-4 w-4" />
                 Reset Grades
               </Button>
             </div>
 
             {/* Add Course Form */}
             <Card className="bg-secondary/50">
               <CardContent className="pt-4">
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex-1">
                     <Input
                       placeholder="Course name"
                       value={newCourseName}
                       onChange={(e) => setNewCourseName(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && addCourse()}
                       maxLength={50}
                     />
                   </div>
                   <div className="w-full sm:w-24">
                     <Input
                       type="number"
                       placeholder="Credits"
                       value={newCourseCredits}
                       onChange={(e) => setNewCourseCredits(e.target.value)}
                       min="1"
                       max="6"
                     />
                   </div>
                   <Button onClick={addCourse} className="gap-2">
                     <Plus className="h-4 w-4" />
                     Add Course
                   </Button>
                 </div>
               </CardContent>
             </Card>
 
             <div className="grid gap-4">
               {courses.map((course) => (
                 <Card key={course.id} className="transition-all hover:shadow-md">
                   <CardContent className="p-4">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex-1">
                         <h3 className="font-semibold">{course.name}</h3>
                         <span className="text-xs text-muted-foreground">
                           {course.credits} Credit Hour{course.credits > 1 ? "s" : ""}
                         </span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-32 sm:w-40">
                           <Select
                             value={courseGrades[course.id] || ""}
                             onValueChange={(value) => handleGradeChange(course.id, value)}
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
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => removeCourse(course.id)}
                           className="text-destructive hover:text-destructive hover:bg-destructive/10"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
               {courses.length === 0 && (
                 <p className="text-center text-muted-foreground py-8">
                   Add your courses above to calculate GPA
                 </p>
               )}
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
                   Add your previous semesters to calculate cumulative CGPA.
                 </p>
 
                 {/* Add Semester Form */}
                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-secondary/50 rounded-lg">
                   <Input
                     placeholder="Semester name"
                     value={newSemesterName}
                     onChange={(e) => setNewSemesterName(e.target.value)}
                     maxLength={30}
                   />
                   <Input
                     type="number"
                     placeholder="Credits"
                     value={newSemesterCredits}
                     onChange={(e) => setNewSemesterCredits(e.target.value)}
                     min="1"
                     max="30"
                   />
                   <Input
                     type="number"
                     placeholder="GPA (0-4)"
                     value={newSemesterGPA}
                     onChange={(e) => setNewSemesterGPA(e.target.value)}
                     min="0"
                     max="4"
                     step="0.01"
                   />
                   <Button onClick={addSemester} className="gap-2">
                     <Plus className="h-4 w-4" />
                     Add
                   </Button>
                 </div>
 
                 {/* Semester History Table */}
                 {semesters.length > 0 && (
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead>
                         <tr className="border-b">
                           <th className="text-left py-2 font-medium">Semester</th>
                           <th className="text-center py-2 font-medium">CH</th>
                           <th className="text-center py-2 font-medium">GPA</th>
                           <th className="text-center py-2 font-medium"></th>
                         </tr>
                       </thead>
                       <tbody>
                         {semesters.map((sem) => (
                           <tr key={sem.id} className="border-b border-border/50">
                             <td className="py-2">{sem.name}</td>
                             <td className="text-center py-2">{sem.credits}</td>
                             <td className="text-center py-2">{sem.gpa.toFixed(2)}</td>
                             <td className="text-center py-2">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => removeSemester(sem.id)}
                                 className="text-destructive hover:text-destructive h-8 w-8 p-0"
                               >
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 )}
 
                 {semesters.length > 0 && (
                   <div className="p-3 bg-secondary rounded-lg text-sm">
                     <p className="text-muted-foreground">
                       Total: <span className="font-semibold text-foreground">{totalPreviousCredits} credits</span>
                     </p>
                   </div>
                 )}
 
                 {semesters.length > 0 && semesterGPA !== null && (
                   <div className="mt-4 p-4 bg-secondary rounded-lg">
                     <p className="text-sm text-muted-foreground">
                       With {totalPreviousCredits} previous credits + current semester:
                     </p>
                     <p className="text-2xl font-bold text-primary mt-2">
                       Projected CGPA: {cgpa?.toFixed(2)}
                     </p>
                   </div>
                 )}
 
                 {/* Chart */}
                 {semesters.length >= 2 && (
                   <div className="pt-4">
                     <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                       <TrendingUp className="h-4 w-4 text-primary" />
                       GPA Trend
                     </h4>
                     <div className="h-[250px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                           <XAxis 
                             dataKey="name" 
                             tick={{ fontSize: 11 }}
                             className="fill-muted-foreground"
                           />
                           <YAxis 
                             domain={[0, 4]} 
                             ticks={[0, 1, 2, 3, 4]}
                             tick={{ fontSize: 11 }}
                             className="fill-muted-foreground"
                           />
                           <Tooltip 
                             contentStyle={{ 
                               backgroundColor: 'hsl(var(--card))',
                               border: '1px solid hsl(var(--border))',
                               borderRadius: '8px'
                             }}
                             labelFormatter={(_, payload) => payload[0]?.payload?.fullName || ''}
                           />
                           <Legend />
                           <Line 
                             type="monotone" 
                             dataKey="GPA" 
                             stroke="hsl(var(--accent))" 
                             strokeWidth={2}
                             dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                             activeDot={{ r: 6 }}
                           />
                           <Line 
                             type="monotone" 
                             dataKey="CGPA" 
                             stroke="hsl(var(--primary))" 
                             strokeWidth={3}
                             dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                             activeDot={{ r: 6 }}
                           />
                         </LineChart>
                       </ResponsiveContainer>
                     </div>
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
           <p>Pakistani HEC Grading Scale • GPA & CGPA Calculator</p>
         </footer>
       </main>
     </div>
   );
 }