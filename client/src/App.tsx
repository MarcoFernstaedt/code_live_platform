import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import { Toaster } from "react-hot-toast";
import type { FC } from "react";
import ProblemDetailsPage from "./pages/ProblemDetailsPage";

const App: FC = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
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
        <Route path='/problem/:id' element={isSignedIn ? <ProblemDetailsPage /> : <Navigate to='/' replace />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default App;