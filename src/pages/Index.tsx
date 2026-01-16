import Dashboard from "@/components/Dashboard";
import HeroSection from "@/components/HeroSection";
import StudentMetricsForm, { StudentData } from "@/components/StudentMetricsForm";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

type AppState = "hero" | "form" | "dashboard";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("hero");
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setAppState("form");
  };

  const handleFormSubmit = async (data: StudentData) => {
    setIsLoading(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setStudentData(data);
    setIsLoading(false);
    setAppState("dashboard");
  };

  const handleReset = () => {
    setAppState("form");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">AI Student Agent</span>
          </div>
          <div className="flex items-center gap-4">
            {appState !== "hero" && (
              <button
                onClick={() => setAppState("hero")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Home
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {appState === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onGetStarted={handleGetStarted} />
            </motion.div>
          )}

          {appState === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container max-w-6xl mx-auto px-4 py-12"
            >
              <StudentMetricsForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </motion.div>
          )}

          {appState === "dashboard" && studentData && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container max-w-6xl mx-auto px-4 py-8"
            >
              <Dashboard studentData={studentData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 AI Autonomous Student Success Agent</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
