import { Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Home from "./pages/home-business-listing";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here as you build them */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/business/:businessId" element={<BusinessDetail />} /> */}
      </Routes>
    </>
  );
}

export default App;
