import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState(""); // NEW STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await register(name, email, password); // Pass name here
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
      gsap.fromTo(
        cardRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          onComplete: () => gsap.set(cardRef.current, { x: 0 }),
        },
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 px-4">
      <div
        ref={cardRef}
        className="w-full max-w-md p-8 space-y-6 bg-gray-50 dark:bg-[#121212] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800"
      >
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            TaskFlow
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isRegistering ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ONLY SHOW NAME IF REGISTERING */}
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-2.5 mt-1.5 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:border-gray-800 dark:text-white outline-none"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-4 py-2.5 mt-1.5 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:border-gray-800 dark:text-white outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegistering ? "new-password" : "current-password"}
              className="w-full px-4 py-2.5 mt-1.5 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:border-gray-800 dark:text-white outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white bg-black dark:bg-white dark:text-black rounded-xl hover:opacity-80 transition-opacity"
          >
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isRegistering ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
