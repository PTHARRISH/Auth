import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      toast.error("Phone number missing, please try again.");
      navigate("/sendotp");
    }
  }, [phone, navigate]);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be a 6-digit number");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/otp-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "OTP verification failed");
        return;
      }

      // ✅ Store token and username like login
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", data.username);

      toast.success("Login successful ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-5">
          <FaWhatsapp size={48} className="text-green-600 mb-2" />
          <h2 className="text-xl font-semibold text-gray-800">
            WhatsApp Verification Code
          </h2>
        </div>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          pattern="\d{6}"
          placeholder="Enter 6-digit OTP"
          className="w-full p-2 mb-4 border border-gray-300 rounded text-center text-lg tracking-widest"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
        />

        <button
          onClick={handleVerify}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition text-sm"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
