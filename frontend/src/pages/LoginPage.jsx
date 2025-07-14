import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaUserCircle, FaWhatsapp } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔐 Email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", res.data.username);

      toast.success("Login successful ✅");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password ❌");
    }
  };

  // 📱 WhatsApp login redirect
  const handleWhatsAppLogin = () => {
    navigate("/sendotp");
  };

  // 🌐 Google login handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/google-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Google login failed");
        return;
      }

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", data.username);

      toast.success("Google login successful ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-4">
          <FaUserCircle size={48} className="text-blue-600 mb-1" />
          <h2 className="text-lg font-semibold text-gray-700">Login</h2>
        </div>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border border-gray-300 rounded text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit login */}
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 text-sm rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <div className="my-4 text-center text-xs text-gray-500">or</div>

        {/* WhatsApp Login */}
        <button
          onClick={handleWhatsAppLogin}
          className="flex items-center justify-center w-full border py-2 rounded text-green-600 border-green-500 hover:bg-green-50 text-sm transition"
        >
          <FaWhatsapp className="mr-2" />
          Sign in with WhatsApp
        </button>

        {/* Google Login */}
        <div className="mt-3 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login Failed")}
            useOneTap
          />
        </div>

        {/* Signup Redirect */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
