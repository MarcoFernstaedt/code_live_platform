import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailsPage from "./pages/ProblemDetailsPage";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";
import type { FC } from "react";

const App: FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  if (!isLoaded) return null;

  if (location.pathname === "/" && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/problems"
          element={
            isSignedIn ? <ProblemsPage /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/problem/:id"
          element={
            isSignedIn ? <ProblemDetailsPage /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/dashboard"
          element={
            isSignedIn ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default App;