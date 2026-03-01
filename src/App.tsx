import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Trail from "./pages/Trail";
import Lesson from "./pages/Lesson";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Exercises from "./pages/Exercises";
import ExerciseDetail from "./pages/ExerciseDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trilha" element={<ProtectedRoute><Trail /></ProtectedRoute>} />
            <Route path="/aula/:id" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/exercicios" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
            <Route path="/exercicio/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
            <Route path="/entrevistas" element={<Interview />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
