import { useState } from "react";
// import { signIn, signUp, confirmSignUp, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
// import "../aws-config";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/shared/Button";


type Mode = "login" | "signup" | "confirm";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // ── LOGIN ────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    try {
      setLoading(true);
      // await signIn({ username: email, password });
      // const session = await fetchAuthSession();
      // const token = session.tokens?.idToken?.toString();
      // console.log("TOKEN:", token);
      nav("/");
    } catch (error: any) {
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ── SIGNUP ───────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    try {
      setLoading(true);
      // await signUp({
      //   username: email,
      //   password,
      //   options: { userAttributes: { email } },
      // });
      setMode("confirm");
    } catch (error: any) {
      alert(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ── CONFIRM ──────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    try {
      setLoading(true);
      // await confirmSignUp({ username: email, confirmationCode: code });
      setMode("login");
    } catch (error: any) {
      alert(error.message || "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  // ── AUTH CHECK (uncomment to redirect already-logged-in users) ───────────
  // useEffect(() => {
  //   const checkUser = async () => {
  //     try {
  //       await getCurrentUser();
  //       nav("/");
  //     } catch {}
  //   };
  //   checkUser();
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm border border-gray-100">

        

        {mode === "login" && (
          <>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />

            <Button variant="info" className="w-full py-3 text-base" onClick={handleLogin}>
              {loading ? "Please wait..." : "Enter"}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-5">
              Do not have an account?{" "}
              <span className="text-green-600 underline cursor-pointer font-medium" onClick={() => setMode("signup")}>
                Sign up
              </span>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Register</h2>

            <label className="block text-sm text-gray-600 mb-1 font-medium">Email:</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />

            <label className="block text-sm text-gray-600 mb-1 font-medium">Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />

            <Button variant="info" className="w-full py-3 text-base" onClick={handleSignup}>
              {loading ? "Please wait..." : "Enter"}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-5">
              Already have an account?{" "}
              <span className="text-green-600 underline cursor-pointer font-medium" onClick={() => setMode("login")}>
                Login
              </span>
            </p>
          </>
        )}

        {mode === "confirm" && (
          <>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Confirm Email</h2>

            <input
              type="text"
              placeholder="Enter Verification Token"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mb-6 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />

            <Button variant="info" className="w-full py-3 text-base" onClick={handleConfirm}>
              {loading ? "Please wait..." : "Verify"}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-5">
              Back to{" "}
              <span className="text-green-600 underline cursor-pointer font-medium" onClick={() => setMode("login")}>
                Login
              </span>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default Auth;