import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, Loader2, Plus, Sparkles, Target, Trash2 } from "lucide-react";
import { useState } from "react";

interface Subject {
  name: string;
  marks: number;
  maxMarks: number;
  hoursStudied: number;
}

interface Deadline {
  name: string;
  subject: string;
  daysLeft: number;
}

export interface StudentData {
  attendance: number;
  subjects: Subject[];
  dailyStudyHours: number;
  upcomingDeadlines: Deadline[];
}

interface StudentMetricsFormProps {
  onSubmit: (data: StudentData) => void;
  isLoading: boolean;
}

const defaultSubjects: Subject[] = [
  { name: "Mathematics", marks: 72, maxMarks: 100, hoursStudied: 8 },
  { name: "Physics", marks: 65, maxMarks: 100, hoursStudied: 6 },
  { name: "Chemistry", marks: 78, maxMarks: 100, hoursStudied: 5 },
  { name: "Computer Science", marks: 85, maxMarks: 100, hoursStudied: 10 },
  { name: "English", marks: 80, maxMarks: 100, hoursStudied: 4 },
];

const defaultDeadlines: Deadline[] = [
  { subject: "Mathematics", daysLeft: 3, name: "Chapter 5 Assignment" },
  { subject: "Physics", daysLeft: 5, name: "Lab Report" },
  { subject: "Computer Science", daysLeft: 7, name: "Project Submission" },
];

const StudentMetricsForm = ({ onSubmit, isLoading }: StudentMetricsFormProps) => {
  const [attendance, setAttendance] = useState(82);
  const [dailyStudyHours, setDailyStudyHours] = useState(5);

  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [subjectDrafts, setSubjectDrafts] = useState<Subject[]>(defaultSubjects);

  const [deadlines, setDeadlines] = useState<Deadline[]>(defaultDeadlines);
  const [deadlineDrafts, setDeadlineDrafts] = useState<Deadline[]>(defaultDeadlines);

  const [newSubject, setNewSubject] = useState("");
  const [newDeadline, setNewDeadline] = useState<Deadline>({ name: "", subject: "", daysLeft: 1 });

  const [subjectSaved, setSubjectSaved] = useState(false);
  const [deadlineSaved, setDeadlineSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      attendance,
      subjects,
      dailyStudyHours,
      upcomingDeadlines: deadlines,
    });
  };

  // Subject Handlers
  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjectDrafts([
        ...subjectDrafts,
        { name: newSubject.trim(), marks: 70, maxMarks: 100, hoursStudied: 5 },
      ]);
      setNewSubject("");
    }
  };
  const removeSubjectDraft = (index: number) => {
    setSubjectDrafts(subjectDrafts.filter((_, i) => i !== index));
  };
  const saveSubjects = () => {
    setSubjects(subjectDrafts);
    setSubjectSaved(true);
    setTimeout(() => setSubjectSaved(false), 1500);
  };

  // Deadline Handlers
  const addDeadline = () => {
    if (newDeadline.name.trim() && newDeadline.subject.trim()) {
      setDeadlineDrafts([...deadlineDrafts, newDeadline]);
      setNewDeadline({ name: "", subject: "", daysLeft: 1 });
    }
  };
  const removeDeadline = (index: number) => {
    setDeadlineDrafts(deadlineDrafts.filter((_, i) => i !== index));
  };
  const saveDeadlines = () => {
    setDeadlines(deadlineDrafts);
    setDeadlineSaved(true);
    setTimeout(() => setDeadlineSaved(false), 1500);
  };

  const averageMarks = Math.round(
    subjects.reduce((acc, s) => acc + (s.marks / s.maxMarks) * 100, 0) / subjects.length
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold mb-2">Enter Your Academic Data</h2>
        <p className="text-muted-foreground">
          Provide your current metrics for AI-powered analysis and personalized study plan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Metrics */}
        <motion.div className="glass-card p-6 rounded-2xl">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> General Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Attendance Rate
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="pr-12 h-12 text-lg font-medium rounded-xl"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Daily Study Hours
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={16}
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                  className="pr-12 h-12 text-lg font-medium rounded-xl"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">hrs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subjects Section */}
        <motion.div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Subject-wise Performance
            </h3>
            <div className="text-sm text-muted-foreground">
              Average: <span className="font-semibold text-foreground">{averageMarks}%</span>
            </div>
          </div>

          <div className="space-y-4">
            {subjectDrafts.map((subject, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex-1 min-w-0">
                  <Input
                    value={subject.name}
                    onChange={(e) => {
                      const updated = [...subjectDrafts];
                      updated[index].name = e.target.value;
                      setSubjectDrafts(updated);
                    }}
                  />
                </div>
                <Input
                  type="number"
                  min={0}
                  max={subject.maxMarks}
                  value={subject.marks}
                  onChange={(e) => {
                    const updated = [...subjectDrafts];
                    updated[index].marks = Number(e.target.value);
                    setSubjectDrafts(updated);
                  }}
                  className="w-20 text-center"
                />
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={subject.hoursStudied}
                  onChange={(e) => {
                    const updated = [...subjectDrafts];
                    updated[index].hoursStudied = Number(e.target.value);
                    setSubjectDrafts(updated);
                  }}
                  className="w-16 text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubjectDraft(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add Subject */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Add new subject..."
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
            />
            <Button type="button" variant="outline" onClick={addSubject}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="button" variant="outline" onClick={saveSubjects}>
              Save Subjects
            </Button>
          </div>
          {subjectSaved && <p className="text-green-500 text-sm mt-2">Subjects saved!</p>}
        </motion.div>

        {/* Deadlines Section */}
        <motion.div className="glass-card p-6 rounded-2xl">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-warning" /> Upcoming Deadlines
          </h3>

          <div className="space-y-3">
            {deadlineDrafts.map((deadline, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/50 bg-muted/10">
                <Input
                  value={deadline.name}
                  onChange={(e) => {
                    const updated = [...deadlineDrafts];
                    updated[index].name = e.target.value;
                    setDeadlineDrafts(updated);
                  }}
                  className="flex-1"
                />
                <Input
                  value={deadline.subject}
                  onChange={(e) => {
                    const updated = [...deadlineDrafts];
                    updated[index].subject = e.target.value;
                    setDeadlineDrafts(updated);
                  }}
                  className="w-32 text-center"
                />
                <Input
                  type="number"
                  value={deadline.daysLeft}
                  onChange={(e) => {
                    const updated = [...deadlineDrafts];
                    updated[index].daysLeft = Number(e.target.value);
                    setDeadlineDrafts(updated);
                  }}
                  className="w-20 text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDeadline(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Deadline */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Input
              placeholder="Deadline name..."
              value={newDeadline.name}
              onChange={(e) => setNewDeadline({ ...newDeadline, name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Subject..."
              value={newDeadline.subject}
              onChange={(e) => setNewDeadline({ ...newDeadline, subject: e.target.value })}
              className="w-32"
            />
            <Input
              type="number"
              min={1}
              placeholder="Days left"
              value={newDeadline.daysLeft}
              onChange={(e) => setNewDeadline({ ...newDeadline, daysLeft: Number(e.target.value) })}
              className="w-20"
            />
            <Button type="button" variant="outline" onClick={addDeadline}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {/* Save Deadlines */}
          <div className="flex justify-end mt-4">
            <Button type="button" variant="outline" onClick={saveDeadlines}>
              Save Deadlines
            </Button>
          </div>
          {deadlineSaved && <p className="text-green-500 text-sm mt-2">Deadlines saved!</p>}
        </motion.div>

        {/* Submit Button */}
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI is analyzing your data...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Study Plan
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default StudentMetricsForm;
