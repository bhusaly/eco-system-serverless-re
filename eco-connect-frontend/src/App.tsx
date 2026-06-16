import { Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Home from "./pages/home-business-listing";
import Auth from "./pages/sign-in";
import BusinessDetail from "./pages/business-detail";
import Profile from "./pages/profile";


function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/business/:id" element={<BusinessDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
