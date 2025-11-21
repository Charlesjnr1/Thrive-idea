import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import SubmitIdea from "./pages/SubmitIdea";
import MyIdeas from "./pages/MyIdeas";
import NotFound from "./pages/NotFound";
import SavedIdeas from "./pages/SavedIdeas";
import IdeaDetail from "./pages/IdeaDetail";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/submit-idea" element={<SubmitIdea />} />
            <Route path="/my-ideas" element={<MyIdeas />} />
            <Route path="/saved" element={<SavedIdeas />} />
            <Route path="/idea/:id" element={<IdeaDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/admin/*" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
