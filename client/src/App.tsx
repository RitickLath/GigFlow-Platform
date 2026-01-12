import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/ui/Landing";
import Login from "./components/ui/Login";
import Register from "./components/ui/Register";
import CreateGig from "./components/generic/CreateGig";
import Navbar from "./components/ui/Navbar";
import GigDetail from "./components/ui/GigDetail";
import Dashboard from "./components/ui/Dashboard";
import Gigs from "./components/ui/Gigs";
const App = () => {
  return (
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
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
