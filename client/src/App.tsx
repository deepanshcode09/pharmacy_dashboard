import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PharmacyProvider } from "./contexts/PharmacyContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Login} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"}>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path={"/medicines"}>
        <ProtectedRoute>
          <Medicines />
        </ProtectedRoute>
      </Route>
      <Route path={"/customers"}>
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      </Route>
      <Route path={"/suppliers"}>
        <ProtectedRoute>
          <Suppliers />
        </ProtectedRoute>
      </Route>
      <Route path={"/billing"}>
        <ProtectedRoute>
          <Billing />
        </ProtectedRoute>
      </Route>
      <Route path={"/reports"}>
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      </Route>
      <Route path={"/notifications"}>
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      </Route>
      <Route path={"/settings"}>
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <PharmacyProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </PharmacyProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
