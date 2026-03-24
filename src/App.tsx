import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import { Loader2 } from "lucide-react";

// Eager: landing page loads fast
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Language pages (C + Python) — lazy loaded
const LanguageLanding = lazy(() => import("./pages/LanguageLanding"));
const LanguageTrail = lazy(() => import("./pages/LanguageTrail"));
const LanguageExercises = lazy(() => import("./pages/LanguageExercises"));
const LanguageExerciseDetail = lazy(() => import("./pages/LanguageExerciseDetail"));

// Lazy: heavy pages loaded on demand
const Trail = lazy(() => import("./pages/Trail"));
const Lesson = lazy(() => import("./pages/Lesson"));
const Interview = lazy(() => import("./pages/Interview"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const Exercises = lazy(() => import("./pages/Exercises"));
const ExerciseDetail = lazy(() => import("./pages/ExerciseDetail"));
const Exam = lazy(() => import("./pages/Exam"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trilha" element={<ProtectedRoute><Trail /></ProtectedRoute>} />
              <Route path="/aula/:id" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
              <Route path="/exercicios" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
              <Route path="/exercicio/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
              <Route path="/entrevistas" element={<Interview />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/prova" element={<Exam />} />
              <Route path="/admin" element={<Admin />} />

              {/* ── Python routes ── */}
              <Route path="/python" element={<LanguageProvider lang="python"><LanguageLanding /></LanguageProvider>} />
              <Route path="/python/trilha" element={<ProtectedRoute><LanguageProvider lang="python"><LanguageTrail /></LanguageProvider></ProtectedRoute>} />
              <Route path="/python/exercicios" element={<ProtectedRoute><LanguageProvider lang="python"><LanguageExercises /></LanguageProvider></ProtectedRoute>} />
              <Route path="/python/exercicio/:id" element={<ProtectedRoute><LanguageProvider lang="python"><LanguageExerciseDetail /></LanguageProvider></ProtectedRoute>} />

              {/* ── C routes ── */}
              <Route path="/c" element={<LanguageProvider lang="c"><LanguageLanding /></LanguageProvider>} />
              <Route path="/c/trilha" element={<ProtectedRoute><LanguageProvider lang="c"><LanguageTrail /></LanguageProvider></ProtectedRoute>} />
              <Route path="/c/exercicios" element={<ProtectedRoute><LanguageProvider lang="c"><LanguageExercises /></LanguageProvider></ProtectedRoute>} />
              <Route path="/c/exercicio/:id" element={<ProtectedRoute><LanguageProvider lang="c"><LanguageExerciseDetail /></LanguageProvider></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
