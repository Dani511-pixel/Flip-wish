import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CreateCollection from "@/pages/CreateCollection";
import Dashboard from "@/pages/Dashboard";
import MessageSubmission from "@/pages/MessageSubmission";
import ViewFlipbook from "@/pages/ViewFlipbook";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/create-collection" component={CreateCollection} />
      <Route path="/submit/:slug">
        {params => <MessageSubmission slug={params.slug} />}
      </Route>
      <Route path="/flipbook/:id">
        {params => <ViewFlipbook id={parseInt(params.id)} />}
      </Route>
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

// Create a new query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
