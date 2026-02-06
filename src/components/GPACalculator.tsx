import { useState, useMemo, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Calculator, RotateCcw, Info, TrendingUp, Plus, Trash2, Download, Share2, Check, XCircle, GraduationCap, Award } from "lucide-react";
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

interface Semester {
  id: string;
  name: string;
  credits: number;
  gpa: number;
  repeatedCredits?: number; // Credits that are repeats (not counted toward total)
}

type CourseGrades = Record<string, string>;

// Use cryptographically secure ID generation
const generateId = generateSecureId;

export function GPACalculator() {
  // Courses state
  const [courses, setCourses] = useLocalStorage<Course[]>("gpa-courses", [
    { id: generateId(), name: "Course 1", credits: 3 },
  ]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState("3");
  
  // Grades state
  const [courseGrades, setCourseGrades] = useLocalStorage<CourseGrades>("gpa-grades", {});
  
  // Previous semesters state - 8 fixed semesters
  const defaultSemesters: Semester[] = Array.from({ length: 8 }, (_, i) => ({
    id: `semester-${i + 1}`,
    name: `Semester ${i + 1}`,
    credits: 0,
    gpa: 0,
    repeatedCredits: 0,
  }));
  
  const [semesters, setSemesters] = useLocalStorage<Semester[]>("gpa-semesters-v3", defaultSemesters);

  // Load from URL share link if present (takes priority over localStorage)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      try {
        // Use safe JSON parsing with prototype pollution protection
        const decoded = safeJSONParse(atob(data), null);
        
        // Validate the data structure before processing
        if (!validateSharedData(decoded)) {
          console.warn("Invalid shared data structure");
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
            name: sanitizeInput(c.n).substring(0, 50), // Sanitize and limit length
            credits: Math.min(Math.max(c.cr, 1), 6), // Validate credit range
          }));
          setCourses(loadedCourses);
          
          if (decoded.g && Array.isArray(decoded.g)) {
            const grades: CourseGrades = {};
            decoded.g.forEach((g: { i: number; g: string }) => {
              if (loadedCourses[g.i] && typeof g.g === 'string') {
                // Validate grade is in allowed list
                const isValidGrade = GRADES.some(grade => grade.value === g.g);
                if (isValidGrade) {
                  grades[loadedCourses[g.i].id] = g.g;
                }
              }
            });
            setCourseGrades(grades);
          }
        }
        if (decoded.s && Array.isArray(decoded.s)) {
          setSemesters(decoded.s.map((s: { n: string; cr: number; g: number }) => ({
            id: generateId(),
            name: sanitizeInput(s.n).substring(0, 30), // Sanitize and limit length
            credits: Math.min(Math.max(s.cr, 1), 50), // Validate credit range
            gpa: Math.min(Math.max(s.g, 0), 4), // Validate GPA range
          })));
        }
        // Clear the URL params after loading
        window.history.replaceState({}, "", window.location.pathname);
        toast({
          title: "Data loaded",
          description: "Shared GPA data has been loaded successfully.",
        });
      } catch (error) {
        console.warn("Failed to load shared data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load shared data. The link may be corrupted.",
          variant: "destructive",
        });
      }
    }
  }, []);

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

  // Calculate effective credits considering repeats
  const calculateEffectiveCredits = (semester: Semester) => {
    const repeated = semester.repeatedCredits || 0;
    const effective = Math.max(0, semester.credits - repeated);
    return { effective, repeated };
  };
  
  // Calculate totals with repeat handling
  const semesterStats = useMemo(() => {
    return semesters.map(sem => {
      const { effective, repeated } = calculateEffectiveCredits(sem);
      return {
        ...sem,
        effectiveCredits: effective,
        repeatedCredits: repeated,
        qualityPoints: sem.gpa * effective
      };
    });
  }, [semesters]);
  
  // Only count semesters with actual data (credits > 0 and gpa > 0)
  const activeSemesters = semesterStats.filter(s => s.effectiveCredits > 0 && s.gpa > 0);
  const totalPreviousCredits = activeSemesters.reduce((sum, s) => sum + s.effectiveCredits, 0);
  const totalRepeatedCredits = activeSemesters.reduce((sum, s) => sum + s.repeatedCredits, 0);

  const cgpa = useMemo(() => {
    if (semesterGPA === null) return null;
    
    // Use effective credits (accounting for repeats)
    const totalPrevCredits = activeSemesters.reduce((sum, s) => sum + s.effectiveCredits, 0);
    
    if (totalPrevCredits === 0) {
      return semesterGPA;
    }
    
    const totalPrevPoints = activeSemesters.reduce((sum, s) => sum + s.qualityPoints, 0);
    
    const currentCredits = courses.reduce((sum, course) => {
      return courseGrades[course.id] ? sum + course.credits : sum;
    }, 0);
    const currentPoints = semesterGPA * currentCredits;
    
    return (totalPrevPoints + currentPoints) / (totalPrevCredits + currentCredits);
  }, [semesterGPA, activeSemesters, courseGrades, courses]);

  // Chart data - only show semesters with data
  const chartData = useMemo(() => {
    let cumCredits = 0;
    let cumPoints = 0;
    
    return semesterStats
      .filter((sem) => sem.effectiveCredits > 0 && sem.gpa > 0)
      .map((sem) => {
        cumCredits += sem.effectiveCredits;
        cumPoints += sem.qualityPoints;
        const calculatedCgpa = cumPoints / cumCredits;
        
        return {
          name: `Sem ${sem.name.replace(/\D/g, "")}`,
          fullName: sem.name,
          GPA: sem.gpa,
          CGPA: parseFloat(calculatedCgpa.toFixed(2)),
        };
      });
  }, [semesterStats]);

  const handleGradeChange = (courseId: string, value: string) => {
    setCourseGrades((prev) => ({ ...prev, [courseId]: value }));
  };

  const addCourse = () => {
    if (!newCourseName.trim()) return;
    const credits = parseInt(newCourseCredits) || 3;
    // Sanitize course name to prevent XSS
    const sanitizedName = sanitizeInput(newCourseName).substring(0, 50);
    if (!sanitizedName) {
      toast({
        title: "Invalid course name",
        description: "Course name contains invalid characters.",
        variant: "destructive",
      });
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

  // Update a specific semester
  const updateSemester = (index: number, credits: string, gpa: string, repeatedCredits?: string) => {
    const creditValue = credits === "" ? 0 : parseInt(credits) || 0;
    const gpaValue = gpa === "" ? 0 : parseFloat(gpa) || 0;
    const repeatedValue = repeatedCredits === undefined ? undefined : (repeatedCredits === "" ? 0 : parseInt(repeatedCredits) || 0);
    
    setSemesters((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        credits: Math.min(Math.max(creditValue, 0), 50),
        gpa: Math.min(Math.max(gpaValue, 0), 4),
        ...(repeatedValue !== undefined && { repeatedCredits: Math.min(Math.max(repeatedValue, 0), creditValue) }),
      };
      return updated;
    });
  };

  // Reset all semesters
  const resetSemesters = () => {
    setSemesters(defaultSemesters);
    toast({
      title: "Semesters reset",
      description: "All semester data has been cleared.",
    });
  };

  const handleReset = () => {
    setCourseGrades({});
  };

  const handleClearAll = () => {
    setCourses([{ id: generateId(), name: "Course 1", credits: 3 }]);
    setCourseGrades({});
    setSemesters(defaultSemesters);
    toast({
      title: "All data cleared",
      description: "Your courses, grades, and semesters have been reset.",
    });
  };

  const gradedCoursesCount = Object.keys(courseGrades).length;
  
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate share link with current state
  const generateShareLink = () => {
    const state = {
      c: courses.map(c => ({ n: c.name, cr: c.credits })),
      g: Object.entries(courseGrades).map(([id, grade]) => {
        const courseIndex = courses.findIndex(c => c.id === id);
        return courseIndex >= 0 ? { i: courseIndex, g: grade } : null;
      }).filter(Boolean),
      s: semesters.map(s => ({ n: s.name, cr: s.credits, g: s.gpa })),
    };
    const encoded = btoa(JSON.stringify(state));
    return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
  };

  const handleCopyLink = async () => {
    // Check if clipboard API is available and in secure context
    if (!isClipboardAvailable()) {
      toast({
        title: "Clipboard not available",
        description: "Clipboard access requires HTTPS or localhost. Please copy the link manually from the address bar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const link = generateShareLink();
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link with others to show your GPA results.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Clipboard error:", error);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async () => {
    if (!resultCardRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(resultCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.setFillColor(34, 139, 34);
      pdf.rect(0, 0, 210, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text('GPA Calculator Results', 105, 18, { align: 'center' });
      
      pdf.addImage(imgData, 'PNG', 10, 35, imgWidth, imgHeight);
      
      // Add course details
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
        // Sanitize course name for PDF to prevent injection
        const sanitizedCourseName = sanitizeForPDF(course.name);
        const sanitizedGradeLabel = sanitizeForPDF(gradeLabel);
        pdf.text(`• ${sanitizedCourseName} (${course.credits} CH): ${sanitizedGradeLabel}`, 15, yPos);
        yPos += 6;
      });
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} • Pakistani HEC Grading Scale`, 105, 285, { align: 'center' });
      
      pdf.save('gpa-results.pdf');
      
      toast({
        title: "PDF exported!",
        description: "Your GPA results have been saved as a PDF.",
      });
    } catch {
      toast({
        title: "Export failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* GPA Display Card */}
      <div ref={resultCardRef} className="relative overflow-hidden rounded-2xl bg-card border-2 border-border shadow-xl">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-2xl" />
        <div className="absolute inset-[2px] bg-card rounded-2xl" />
        
        <div className="relative p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Total Credits */}
            <div className="text-center p-5 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 hover:bg-muted transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Credits</p>
              <p className="text-4xl md:text-5xl font-bold text-foreground">{totalCredits}</p>
            </div>
            
            {/* Semester GPA - Highlighted */}
            <div className="relative text-center p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
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
            
            {/* CGPA */}
            <div className="text-center p-5 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 hover:bg-muted transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">CGPA</p>
              <p className="text-4xl md:text-5xl font-bold text-foreground">
                {cgpa !== null ? cgpa.toFixed(2) : "—"}
              </p>
            </div>
          </div>
          
          {/* Export/Share Buttons */}
          {semesterGPA !== null && (
            <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyLink}
                className="gap-2"
              >
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
            <span className="hidden sm:inline">Courses</span>
            <span className="sm:hidden">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="cgpa" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">CGPA</span>
            <span className="sm:hidden">CGPA</span>
          </TabsTrigger>
          <TabsTrigger value="scale" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Grade Scale</span>
            <span className="sm:hidden">Scale</span>
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
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

          {/* Add Course Form */}
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
                <p className="text-muted-foreground">Add your courses above to calculate GPA</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* CGPA Tab */}
        <TabsContent value="cgpa">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">All 8 Semesters</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Enter your credit hours and GPA for each semester
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetSemesters}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 8 Semester Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {semesters.map((semester, index) => {
                  const stats = semesterStats[index];
                  const hasRepeat = stats && stats.repeatedCredits > 0;
                  
                  return (
                  <div 
                    key={semester.id} 
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      semester.credits > 0 && semester.gpa > 0
                        ? hasRepeat 
                          ? 'bg-amber/5 border-amber/30 shadow-sm'
                          : 'bg-primary/5 border-primary/30 shadow-sm'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        semester.credits > 0 && semester.gpa > 0
                          ? hasRepeat
                            ? 'bg-amber/10'
                            : 'bg-primary/10'
                          : 'bg-muted'
                      }`}>
                        <span className={`text-sm font-bold ${
                          semester.credits > 0 && semester.gpa > 0
                            ? hasRepeat
                              ? 'text-amber-600'
                              : 'text-primary'
                            : 'text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-semibold text-sm text-foreground">
                        {semester.name}
                      </span>
                      <div className="ml-auto flex items-center gap-1">
                        {hasRepeat && (
                          <span className="px-2 py-0.5 bg-amber/10 text-amber-600 text-xs font-medium rounded-full">
                            Repeat
                          </span>
                        )}
                        {semester.credits > 0 && semester.gpa > 0 && !hasRepeat && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Credit Hours
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={semester.credits || ''}
                          onChange={(e) => updateSemester(index, e.target.value, semester.gpa.toString())}
                          min="0"
                          max="50"
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          GPA (0-4)
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={semester.gpa || ''}
                          onChange={(e) => updateSemester(index, semester.credits.toString(), e.target.value)}
                          min="0"
                          max="4"
                          step="0.01"
                          className="h-10"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Repeated Credits (optional)
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={semester.repeatedCredits || ''}
                          onChange={(e) => updateSemester(index, semester.credits.toString(), semester.gpa.toString(), e.target.value)}
                          min="0"
                          max={semester.credits}
                          className="h-10"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Credits not counted in CGPA
                        </p>
                      </div>
                      
                      {semester.credits > 0 && semester.gpa > 0 && (
                        <div className="pt-2 border-t border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Effective Credits</span>
                            <span className="text-sm font-semibold text-primary">
                              {stats.effectiveCredits}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">Quality Points</span>
                            <span className="text-sm font-semibold text-primary">
                              {(stats.effectiveCredits * semester.gpa).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Summary Cards */}
              {totalPreviousCredits > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Effective Credits</p>
                    <p className="text-2xl font-bold text-foreground">{totalPreviousCredits}</p>
                    {totalRepeatedCredits > 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        {totalRepeatedCredits} repeated (not counted)
                      </p>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Previous GPA</p>
                    <p className="text-2xl font-bold text-foreground">
                      {(activeSemesters.reduce((sum, s) => sum + s.qualityPoints, 0) / Math.max(totalPreviousCredits, 1)).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Current Semester</p>
                    <p className="text-2xl font-bold text-foreground">
                      {semesterGPA !== null ? semesterGPA.toFixed(2) : "—"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Combined CGPA</p>
                    <p className="text-3xl font-bold text-primary">
                      {cgpa !== null ? cgpa.toFixed(2) : "—"}
                    </p>
                  </div>
                </div>
              )}

              {/* Chart */}
              {chartData.filter(d => d.GPA > 0).length >= 2 && (
                <div className="pt-4">
                  <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    GPA Trend Over Semesters
                  </h4>
                  <div className="h-[280px] w-full bg-muted/30 rounded-xl p-4 border border-border/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={chartData.filter(d => d.GPA > 0)} 
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis 
                          domain={[0, 4]} 
                          ticks={[0, 1, 2, 3, 4]}
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
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
