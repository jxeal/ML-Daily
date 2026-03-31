import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/components/auth/auth-provider";
import Auth from "@/pages/auth";

// Pages
import Home from "@/pages/home";
import Categories from "@/pages/categories";
import LessonDetail from "@/pages/lesson-detail";
import Progress from "@/pages/progress";
import ProgressCategory from "@/pages/progress-category";
import Profile from "@/pages/profile";
import Badges from "@/pages/badges";
import DailyChallenge from "@/pages/challenge";
import CategoryDetail from "@/pages/category-detail";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/categories/:id" component={CategoryDetail} />
      <Route path="/lessons/:id" component={LessonDetail} />
      <Route path="/challenge/:id" component={DailyChallenge} />
      <Route path="/progress" component={Progress} />
      <Route path="/progress/:id" component={ProgressCategory} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/:username" component={Profile} />
      <Route path="/profile/:username/badges" component={Badges} />
      <Route path="/badges" component={Badges} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
