import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import MessageSubmission from "@/pages/MessageSubmission";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import CreateCollection from "@/pages/CreateCollection";
import ViewFlipbook from "@/pages/ViewFlipbook";
import Home from "@/pages/Home";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        {user ? <Dashboard /> : <Login />}
      </Route>
      <Route path="/create-collection">
        {user ? <CreateCollection /> : <Login />}
      </Route>
      <Route path="/submit/:slug">
        {(params) => <MessageSubmission slug={params.slug} />}
      </Route>
      <Route path="/flipbook/:id">
        {(params) => user ? <ViewFlipbook id={parseInt(params.id)} /> : <Login />}
      </Route>
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;
