import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Subject {
  name: string;
  marks: number;
  maxMarks: number;
  hoursStudied: number;
}

interface Deadline {
  subject: string;
  daysLeft: number;
  name: string;
}

interface DashboardProps {
  studentData: {
    attendance: number;
    subjects: Subject[];
    dailyStudyHours: number;
    upcomingDeadlines: Deadline[];
  };
  onReset: () => void;
}

const Dashboard = ({ studentData, onReset }: DashboardProps) => {
  // Calculate overall metrics
  const averageMarks = Math.round(
    studentData.subjects.reduce((acc, s) => acc + (s.marks / s.maxMarks) * 100, 0) / studentData.subjects.length
  );

  // AI Prediction using weighted formula (simulating ML model)
  const predictedGrade = Math.min(100, Math.round(
    (studentData.attendance * 0.25) +
    (averageMarks * 0.45) +
    (studentData.dailyStudyHours * 4) +
    (Math.max(0, 10 - studentData.upcomingDeadlines.length) * 1.5)
  ));

  const riskLevel = predictedGrade >= 75 ? "low" : predictedGrade >= 55 ? "medium" : "high";

  // Identify weak subjects (below 70%)
  const weakSubjects = studentData.subjects
    .filter(s => (s.marks / s.maxMarks) * 100 < 70)
    .sort((a, b) => (a.marks / a.maxMarks) - (b.marks / b.maxMarks));

  // Generate AI Study Plan based on performance
  const generateStudyPlan = () => {
    const urgentDeadlines = studentData.upcomingDeadlines.filter(d => d.daysLeft <= 3);
    const plan = [];

    // Morning: Weak subject focus
    if (weakSubjects.length > 0) {
      plan.push({
        time: "6:00 AM - 8:00 AM",
        activity: "Deep Focus: Weak Subject",
        subject: weakSubjects[0].name,
        priority: "critical",
        reason: `Score: ${weakSubjects[0].marks}% - Needs improvement`
      });
    }

    // Mid-morning: Practice problems
    plan.push({
      time: "9:00 AM - 11:00 AM",
      activity: "Practice Problems & Revision",
      subject: studentData.subjects.sort((a, b) => a.marks - b.marks)[1]?.name || "General",
      priority: "high",
      reason: "Active recall strengthens memory"
    });

    // Afternoon: Deadline work
    if (urgentDeadlines.length > 0) {
      plan.push({
        time: "2:00 PM - 4:00 PM",
        activity: "Urgent Assignment",
        subject: urgentDeadlines[0].subject,
        priority: "critical",
        reason: `${urgentDeadlines[0].name} due in ${urgentDeadlines[0].daysLeft} days`
      });
    } else {
      plan.push({
        time: "2:00 PM - 4:00 PM",
        activity: "Project Work",
        subject: "Multiple Subjects",
        priority: "medium",
        reason: "Stay ahead of deadlines"
      });
    }

    // Evening: Review
    plan.push({
      time: "5:00 PM - 6:30 PM",
      activity: "Daily Review & Notes",
      subject: "All Subjects",
      priority: "medium",
      reason: "Consolidate today's learning"
    });

    // Night: Strong subject advancement
    const strongSubject = studentData.subjects.sort((a, b) => b.marks - a.marks)[0];
    plan.push({
      time: "8:00 PM - 9:30 PM",
      activity: "Advanced Topics",
      subject: strongSubject?.name || "Self-study",
      priority: "low",
      reason: "Build on your strengths"
    });

    return plan;
  };

  const studyPlan = generateStudyPlan();

  // Generate Smart Alerts
  const alerts = [
    studentData.attendance < 75 && {
      type: "critical",
      icon: AlertTriangle,
      message: "Attendance below 75% - Risk of debarment!",
      action: "Attend all classes this week",
      impact: "High"
    },
    weakSubjects.length > 0 && {
      type: "warning",
      icon: TrendingDown,
      message: `${weakSubjects.length} subject(s) below passing threshold`,
      action: `Focus on ${weakSubjects.map(s => s.name).join(", ")}`,
      impact: "High"
    },
    studentData.upcomingDeadlines.some(d => d.daysLeft <= 2) && {
      type: "critical",
      icon: Bell,
      message: "Deadline approaching in less than 2 days!",
      action: "Complete urgent assignments immediately",
      impact: "Critical"
    },
    studentData.dailyStudyHours < 4 && {
      type: "info",
      icon: Clock,
      message: "Study hours below recommended minimum",
      action: "Increase to at least 4-5 hours daily",
      impact: "Medium"
    },
    predictedGrade < 60 && {
      type: "critical",
      icon: Zap,
      message: "AI predicts risk of academic failure",
      action: "Follow the generated study plan strictly",
      impact: "Critical"
    }
  ].filter(Boolean);

  // Chart data
  const subjectChartData = studentData.subjects.map(s => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + "..." : s.name,
    marks: Math.round((s.marks / s.maxMarks) * 100),
    hours: s.hoursStudied
  }));

  const radarData = studentData.subjects.map(s => ({
    subject: s.name.slice(0, 8),
    score: Math.round((s.marks / s.maxMarks) * 100),
    fullMark: 100
  }));

  const performanceDistribution = [
    { name: "Excellent (>80%)", value: studentData.subjects.filter(s => (s.marks/s.maxMarks)*100 >= 80).length, color: "hsl(var(--success))" },
    { name: "Good (60-80%)", value: studentData.subjects.filter(s => (s.marks/s.maxMarks)*100 >= 60 && (s.marks/s.maxMarks)*100 < 80).length, color: "hsl(var(--primary))" },
    { name: "Needs Work (<60%)", value: studentData.subjects.filter(s => (s.marks/s.maxMarks)*100 < 60).length, color: "hsl(var(--destructive))" },
  ].filter(d => d.value > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold mb-2">AI Student Dashboard</h2>
          <p className="text-muted-foreground">Powered by Machine Learning & Predictive Analytics</p>
        </div>
        <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Update Data
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Attendance", value: `${studentData.attendance}%`, icon: Calendar, trend: studentData.attendance >= 75, color: "primary" },
          { label: "Average Score", value: `${averageMarks}%`, icon: Target, trend: averageMarks >= 60, color: "secondary" },
          { label: "Study Hours", value: `${studentData.dailyStudyHours}h/day`, icon: Clock, trend: studentData.dailyStudyHours >= 4, color: "accent" },
          { label: "Weak Subjects", value: weakSubjects.length.toString(), icon: BookOpen, trend: weakSubjects.length === 0, color: "warning" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-muted-foreground" />
              {stat.trend ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
            </div>
            <div className="text-2xl font-bold font-display mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Performance Prediction */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">AI Performance Prediction</h3>
              <p className="text-sm text-muted-foreground">ML-based grade forecasting</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular Gauge */}
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="75"
                  className="stroke-muted fill-none"
                  strokeWidth="14"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="75"
                  className={`fill-none transition-all duration-1000 ${
                    riskLevel === "low" ? "stroke-success" : 
                    riskLevel === "medium" ? "stroke-warning" : "stroke-destructive"
                  }`}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${predictedGrade * 4.71} 471`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-display">{predictedGrade}%</span>
                <span className="text-sm text-muted-foreground">Predicted</span>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Academic Risk Level</span>
                  <span className={`font-bold uppercase ${
                    riskLevel === "low" ? "text-success" : 
                    riskLevel === "medium" ? "text-warning" : "text-destructive"
                  }`}>
                    {riskLevel}
                  </span>
                </div>
                <Progress 
                  value={riskLevel === "low" ? 20 : riskLevel === "medium" ? 50 : 85} 
                  className="h-3"
                />
              </div>
              
              <div className="p-4 rounded-xl bg-muted/50">
                <h4 className="font-medium text-sm mb-2">AI Recommendation:</h4>
                <p className="text-sm text-muted-foreground">
                  {riskLevel === "low" 
                    ? "Excellent performance! Maintain your routine and aim for even higher scores."
                    : riskLevel === "medium"
                    ? "Room for improvement. Focus on weak subjects and increase study hours."
                    : "Immediate action required! Follow the AI study plan strictly and seek help if needed."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Smart Alerts */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning to-destructive flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg">Proactive Alerts</h3>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
            {alerts.length > 0 ? alerts.map((alert, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl border-l-4 ${
                  alert.type === "critical" ? "bg-destructive/10 border-destructive" :
                  alert.type === "warning" ? "bg-warning/10 border-warning" :
                  "bg-primary/10 border-primary"
                }`}
              >
                <div className="flex items-start gap-2">
                  <alert.icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                    alert.type === "critical" ? "text-destructive" :
                    alert.type === "warning" ? "text-warning" : "text-primary"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.action}</p>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <p className="text-sm font-medium text-success">All metrics are healthy!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Subject Analysis Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Subject Performance */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg">Subject-wise Performance</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="marks" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart - Skills Overview */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg">Skills Radar</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3} 
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* AI Generated Study Plan */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center pulse-dot">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">AI-Generated Study Plan</h3>
              <p className="text-sm text-muted-foreground">Personalized for your success</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyPlan.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                item.priority === "critical" 
                  ? "border-destructive/50 bg-destructive/5" 
                  : item.priority === "high"
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.priority === "critical" 
                    ? "bg-destructive/20 text-destructive" 
                    : item.priority === "high"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {item.priority}
                </span>
              </div>
              <div className="font-semibold mb-1">{item.activity}</div>
              <div className="text-sm text-secondary font-medium mb-2">{item.subject}</div>
              <div className="text-xs text-muted-foreground italic">{item.reason}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weak Subjects Focus */}
      {weakSubjects.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl border-2 border-warning/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Priority Focus Areas</h3>
              <p className="text-sm text-muted-foreground">Subjects requiring immediate attention</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakSubjects.map((subject, index) => {
              const percentage = Math.round((subject.marks / subject.maxMarks) * 100);
              return (
                <div
                  key={subject.name}
                  className="p-4 rounded-xl bg-warning/10 border border-warning/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm font-bold text-warning">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2 mb-3" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">AI Suggestion:</span> Add {Math.max(2, 5 - subject.hoursStudied)} more hours/week
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* System Architecture */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl">
        <h3 className="font-display font-semibold text-lg mb-6 text-center">AI Agent Architecture Flow</h3>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {[
            { label: "Student Data", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
            { label: "Data Processing", icon: BarChart3, color: "from-purple-500 to-pink-500" },
            { label: "ML Prediction", icon: Brain, color: "from-green-500 to-emerald-500" },
            { label: "GenAI Planning", icon: Sparkles, color: "from-yellow-500 to-orange-500" },
            { label: "Adaptive Output", icon: Target, color: "from-red-500 to-pink-500" },
          ].map((step, index) => (
            <div key={step.label} className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.15 }}
                className={`flow-node bg-gradient-to-br ${step.color} text-white flex items-center gap-2`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-xs font-medium whitespace-nowrap">{step.label}</span>
              </motion.div>
              {index < 4 && (
                <ArrowRight className="w-5 h-5 text-primary hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
