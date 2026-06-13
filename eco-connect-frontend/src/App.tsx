import { Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Home from "./pages/home-business-listing";
import Auth from "./pages/sign-in";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/business/:businessId" element={<BusinessDetail />} /> */}
      </Routes>
    </>
  );
}

export default App;
