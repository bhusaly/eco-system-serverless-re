import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "./Layout";
import { Button } from "./Button";
import { getCurrentUser, signOut } from "aws-amplify/auth";

export const Navbar: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [loggedin, setIsLoggedin] = useState<boolean | null>(null);

  // Check if user is authenticated
  const checkUser = async () => {
    try {
      await getCurrentUser();
      setIsLoggedin(true);
    } catch {
      setIsLoggedin(false);
    }
  };

  // Re-check on every route change
  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedin(false);
      nav("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-green-100">
      <Container>
        <div className="flex items-center justify-between py-2">

          {/* LOGO */}
          <div
            onClick={() => nav("/")}
            className="text-xl font-semibold text-green-600 cursor-pointer"
          >
            EcoConnect
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {loggedin === true ? (
              <>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
                <Button variant="success" onClick={() => nav("/profile")}>
                  Profile
                </Button>
              </>
            ) : loggedin === false ? (
              <Button variant="success" onClick={() => nav("/login")}>
                Sign In
              </Button>
            ) : (
              // null = still checking auth, show neutral placeholder
              <div className="text-sm text-gray-400">...</div>
            )}
          </div>

        </div>
      </Container>
    </nav>
  );
};

export default Navbar;