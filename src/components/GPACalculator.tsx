import { useState, useMemo, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Calculator, RotateCcw, Info, TrendingUp, Plus, Trash2, Download, Share2, Check, XCircle, GraduationCap, Award, History } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { 
  sanitizeInput, 
  sanitizeForPDF, 
  generateSecureId, 
  validateSharedData,
  isClipboardAvailable,
  safeJSONParse 
} from "@/lib/security";

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

interface CGPACourse extends Course {
  semester: number;
  grade: string;
  isRepeat?: boolean;
  originalSemester?: number;
}

type CourseGrades = Record<string, string>;

// Use cryptographically secure ID generation
const generateId = generateSecureId;

export function GPACalculator() {
  // Courses state for GPA calculation
  const [courses, setCourses] = useLocalStorage<Course[]>("gpa-courses", [
    { id: generateId(), name: "Course 1", credits: 3 },
  ]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState("3");
  
  // Grades state
  const [courseGrades, setCourseGrades] = useLocalStorage<CourseGrades>("gpa-grades", {});
  
  // CGPA Courses - All courses across all semesters
  const [cgpaCourses, setCgpaCourses] = useLocalStorage<CGPACourse[]>("cgpa-courses", []);
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [newCgpaCourseName, setNewCgpaCourseName] = useState("");
  const [newCgpaCourseCredits, setNewCgpaCourseCredits] = useState("3");
  const [newCgpaCourseGrade, setNewCgpaCourseGrade] = useState("");
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatFromSemester, setRepeatFromSemester] = useState("");

  // Load from URL share link if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      try {
        const decoded = safeJSONParse(atob(data), null);
        
        if (!validateSharedData(decoded)) {
          toast({
            title: "Invalid share link",
            description: "The shared data is corrupted or invalid.",
            variant: "destructive",
          });
          return;
        }
        
        if (decoded.c && Array.isArray(decoded.c)) {
          const loadedCourses = decoded.c.map((c: { n: string; cr: number }) => ({
            id: generateId(),
            name: sanitizeInput(c.n).substring(0, 50),
            credits: Math.min(Math.max(c.cr, 1), 6),
          }));
          setCourses(loadedCourses);
          
          if (decoded.g && Array.isArray(decoded.g)) {
            const grades: CourseGrades = {};
            decoded.g.forEach((g: { i: number; g: string }) => {
              if (loadedCourses[g.i] && typeof g.g === 'string') {
                const isValidGrade = GRADES.some(grade => grade.value === g.g);
                if (isValidGrade) {
                  grades[loadedCourses[g.i].id] = g.g;
                }
              }
            });
            setCourseGrades(grades);
          }
        }
        window.history.replaceState({}, "", window.location.pathname);
        toast({
          title: "Data loaded",
          description: "Shared GPA data has been loaded successfully.",
        });
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Failed to load shared data.",
          variant: "destructive",
        });
      }
    }
  }, []);

  // GPA Calculation
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

  // CGPA Calculation
  const { cgpa, totalCgpaCredits, totalCgpaPoints, semesterStats } = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    const semesterMap = new Map<number, { credits: number; points: number; gpa: number }>();

    // Process all CGPA courses
    cgpaCourses.forEach((course) => {
      const grade = GRADES.find(g => g.value === course.grade);
      if (grade) {
        const points = grade.points * course.credits;
        totalCredits += course.credits;
        totalPoints += points;

        // Track per semester
        const sem = semesterMap.get(course.semester) || { credits: 0, points: 0, gpa: 0 };
        sem.credits += course.credits;
        sem.points += points;
        semesterMap.set(course.semester, sem);
      }
    });

    // Calculate GPA for each semester
    const stats = Array.from(semesterMap.entries())
      .map(([sem, data]) => ({
        semester: sem,
        credits: data.credits,
        gpa: data.credits > 0 ? data.points / data.credits : 0,
        points: data.points
      }))
      .sort((a, b) => a.semester - b.semester);

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return { cgpa, totalCgpaCredits: totalCredits, totalCgpaPoints: totalPoints, semesterStats: stats };
  }, [cgpaCourses]);

  // GPA Tab functions
  const handleGradeChange = (courseId: string, value: string) => {
    setCourseGrades((prev) => ({ ...prev, [courseId]: value }));
  };

  const addCourse = () => {
    if (!newCourseName.trim()) return;
    const credits = parseInt(newCourseCredits) || 3;
    const sanitizedName = sanitizeInput(newCourseName).substring(0, 50);
    if (!sanitizedName) {
      toast({ title: "Invalid course name", variant: "destructive" });
      return;
    }
    setCourses((prev) => [...prev, { id: generateId(), name: sanitizedName, credits: Math.min(credits, 6) }]);
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

  const handleReset = () => {
    setCourseGrades({});
  };

  const handleClearAll = () => {
    setCourses([{ id: generateId(), name: "Course 1", credits: 3 }]);
    setCourseGrades({});
    toast({ title: "All data cleared" });
  };

  // CGPA Tab functions
  const addCgpaCourse = () => {
    if (!newCgpaCourseName.trim() || !newCgpaCourseGrade) {
      toast({ title: "Please enter course name and grade", variant: "destructive" });
      return;
    }
    const credits = parseInt(newCgpaCourseCredits) || 3;
    const semester = parseInt(selectedSemester) || 1;
    const sanitizedName = sanitizeInput(newCgpaCourseName).substring(0, 50);
    
    if (!sanitizedName) {
      toast({ title: "Invalid course name", variant: "destructive" });
      return;
    }

    const newCourse: CGPACourse = {
      id: generateId(),
      name: sanitizedName,
      credits: Math.min(credits, 6),
      semester,
      grade: newCgpaCourseGrade,
      isRepeat,
      ...(isRepeat && repeatFromSemester ? { originalSemester: parseInt(repeatFromSemester) } : {})
    };

    setCgpaCourses((prev) => [...prev, newCourse]);
    setNewCgpaCourseName("");
    setNewCgpaCourseCredits("3");
    setNewCgpaCourseGrade("");
    setIsRepeat(false);
    setRepeatFromSemester("");
  };

  const removeCgpaCourse = (id: string) => {
    setCgpaCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const resetCgpa = () => {
    setCgpaCourses([]);
    toast({ title: "CGPA data cleared" });
  };

  const gradedCoursesCount = Object.keys(courseGrades).length;

  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    const state = {
      c: courses.map(c => ({ n: c.name, cr: c.credits })),
      g: Object.entries(courseGrades).map(([id, grade]) => {
        const courseIndex = courses.findIndex(c => c.id === id);
        return courseIndex >= 0 ? { i: courseIndex, g: grade } : null;
      }).filter(Boolean),
    };
    const encoded = btoa(JSON.stringify(state));
    return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
  };

  const handleCopyLink = async () => {
    if (!isClipboardAvailable()) {
      toast({ title: "Clipboard not available", variant: "destructive" });
      return;
    }
    try {
      const link = generateShareLink();
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({ title: "Link copied!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleExportPDF = async () => {
    if (!resultCardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(resultCardRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.setFillColor(34, 139, 34);
      pdf.rect(0, 0, 210, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text('GPA Calculator Results', 105, 18, { align: 'center' });
      pdf.addImage(imgData, 'PNG', 10, 35, imgWidth, imgHeight);
      
      let yPos = 45 + imgHeight;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text('Course Details', 10, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      courses.forEach((course) => {
        const gradeValue = courseGrades[course.id];
        const grade = GRADES.find(g => g.value === gradeValue);
        const gradeLabel = grade ? grade.label : 'Not graded';
        pdf.text(`• ${sanitizeForPDF(course.name)} (${course.credits} CH): ${sanitizeForPDF(gradeLabel)}`, 15, yPos);
        yPos += 6;
      });
      
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });
      pdf.save('gpa-results.pdf');
      toast({ title: "PDF exported!" });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* GPA Display Card */}
      <div ref={resultCardRef} className="relative overflow-hidden rounded-2xl bg-card border-2 border-border shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-2xl" />
        <div className="absolute inset-[2px] bg-card rounded-2xl" />
        
        <div className="relative p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-5 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Credits</p>
              <p className="text-4xl md:text-5xl font-bold text-foreground">{totalCredits}</p>
            </div>
            
            <div className="relative text-center p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Current
              </div>
              <div className="flex items-center justify-center gap-2 mb-3 mt-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Semester GPA</p>
              <p className="text-5xl md:text-6xl font-bold text-primary">
                {semesterGPA !== null ? semesterGPA.toFixed(2) : "—"}
              </p>
            </div>
            
            <div className="text-center p-5 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Overall CGPA</p>
              <p className="text-4xl md:text-5xl font-bold text-foreground">
                {cgpa > 0 ? cgpa.toFixed(2) : "—"}
              </p>
            </div>
          </div>
          
          {semesterGPA !== null && (
            <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-border/50">
              <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={isExporting} className="gap-2">
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Share Link"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 p-1 bg-muted rounded-xl">
          <TabsTrigger value="courses" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">GPA Calculator</span>
            <span className="sm:hidden">GPA</span>
          </TabsTrigger>
          <TabsTrigger value="cgpa" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">CGPA Tracker</span>
            <span className="sm:hidden">CGPA</span>
          </TabsTrigger>
          <TabsTrigger value="scale" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Grade Scale</span>
            <span className="sm:hidden">Scale</span>
          </TabsTrigger>
        </TabsList>

        {/* GPA Tab - Current Semester */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span>{gradedCoursesCount} of {courses.length} courses graded</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                <XCircle className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Course name (e.g., Calculus I)"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCourse()}
                    maxLength={50}
                    className="h-11"
                  />
                </div>
                <div className="w-full sm:w-28">
                  <Input
                    type="number"
                    placeholder="Credits"
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(e.target.value)}
                    min="1"
                    max="6"
                    className="h-11"
                  />
                </div>
                <Button onClick={addCourse} className="gap-2 h-11 px-6">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            {courses.map((course) => (
              <Card key={course.id} className="group border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{course.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {course.credits} Credit Hour{course.credits > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-36 sm:w-44">
                        <Select
                          value={courseGrades[course.id] || ""}
                          onValueChange={(value) => handleGradeChange(course.id, value)}
                        >
                          <SelectTrigger className="h-10">
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
                        className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-12 bg-muted/50 rounded-xl border border-dashed border-border">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Add your courses to calculate GPA</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* CGPA Tab - All Courses */}
        <TabsContent value="cgpa" className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">All Courses History</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Add all courses from all semesters to calculate CGPA
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={resetCgpa} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Course Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Course name"
                    value={newCgpaCourseName}
                    onChange={(e) => setNewCgpaCourseName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCgpaCourse()}
                    maxLength={50}
                    className="h-11"
                  />
                </div>
                <div>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Semester {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Credits"
                    value={newCgpaCourseCredits}
                    onChange={(e) => setNewCgpaCourseCredits(e.target.value)}
                    min="1"
                    max="6"
                    className="h-11"
                  />
                </div>
                <div>
                  <Select value={newCgpaCourseGrade} onValueChange={setNewCgpaCourseGrade}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Repeat Option */}
              <div className="flex items-center gap-4 px-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRepeat}
                    onChange={(e) => setIsRepeat(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">This is a repeat course</span>
                </label>
                {isRepeat && (
                  <Select value={repeatFromSemester} onValueChange={setRepeatFromSemester}>
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue placeholder="Original semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Semester {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button onClick={addCgpaCourse} className="gap-2 ml-auto">
                  <Plus className="h-4 w-4" />
                  Add Course
                </Button>
              </div>

              {/* Courses List by Semester */}
              {cgpaCourses.length > 0 && (
                <div className="space-y-4">
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((semNum) => {
                    const semCourses = cgpaCourses.filter(c => c.semester === semNum);
                    if (semCourses.length === 0) return null;
                    
                    const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);
                    const semPoints = semCourses.reduce((sum, c) => {
                      const grade = GRADES.find(g => g.value === c.grade);
                      return sum + (grade ? grade.points * c.credits : 0);
                    }, 0);
                    const semGPA = semCredits > 0 ? semPoints / semCredits : 0;
                    
                    return (
                      <div key={semNum} className="border border-border/50 rounded-xl overflow-hidden">
                        <div className="bg-muted/50 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{semNum}</span>
                            </div>
                            <span className="font-semibold">Semester {semNum}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {semCourses.length} courses • {semCredits} CH • GPA: {semGPA.toFixed(2)}
                          </div>
                        </div>
                        <div className="divide-y divide-border/50">
                          {semCourses.map((course) => {
                            const grade = GRADES.find(g => g.value === course.grade);
                            return (
                              <div key={course.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                  <div>
                                    <span className="font-medium">{course.name}</span>
                                    {course.isRepeat && (
                                      <span className="ml-2 px-2 py-0.5 bg-amber/10 text-amber-600 text-xs rounded-full">
                                        Repeat
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">{course.credits} CH</span>
                                  <span className={`font-semibold ${course.grade === '0.00' ? 'text-red-500' : 'text-primary'}`}>
                                    {grade?.label || '-'}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCgpaCourse(course.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Summary */}
              {cgpaCourses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Courses</p>
                    <p className="text-2xl font-bold text-foreground">{cgpaCourses.length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Credits</p>
                    <p className="text-2xl font-bold text-foreground">{totalCgpaCredits}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">CGPA</p>
                    <p className="text-3xl font-bold text-primary">{cgpa.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grade Scale Tab */}
        <TabsContent value="scale">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pakistani HEC Grading Scale</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Official grading scale used by Namal University
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {GRADES.map((grade) => (
                  <div
                    key={grade.value}
                    className="group flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    <span className="font-bold text-lg text-primary">{grade.label}</span>
                    <span className="text-muted-foreground font-medium">{grade.points.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
