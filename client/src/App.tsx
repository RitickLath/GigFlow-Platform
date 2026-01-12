import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/ui/Landing";
import Login from "./components/ui/Login";
import Register from "./components/ui/Register";
import CreateGig from "./components/generic/CreateGig";
import Navbar from "./components/ui/Navbar";
import GigDetail from "./components/ui/GigDetail";
import Dashboard from "./components/ui/Dashboard";
import Gigs from "./components/ui/Gigs";
import AuthWrapper from "./components/generic/AuthWrapper";
import { AuthProvider } from "./hooks/useAuth";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/:id" element={<GigDetail />} />

          {/* Protected */}
          <Route
            path="/create-gig"
            element={
              <AuthWrapper>
                <CreateGig />
              </AuthWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
