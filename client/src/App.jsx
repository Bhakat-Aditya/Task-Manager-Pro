import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SharedView from "./pages/SharedView"; // Ensure this is imported!

// A wrapper to protect our private routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading screen while checking the refresh token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] text-black dark:text-white">
        Loading...
      </div>
    );
  }

  // If not logged in after check, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Public Shared Calendar Route (Secured by Token) */}
      <Route path="/shared/:token" element={<SharedView />} />
    </Routes>
  );
}

export default App;
