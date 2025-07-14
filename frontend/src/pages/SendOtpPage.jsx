import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SendOtpPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/send-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      toast.success("OTP sent successfully via WhatsApp ✅");

      // Navigate to OTP verification page (if implemented)
      navigate("/verify-otp", { state: { phone } });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Top-right toast placement */}
      <Toaster position="top-right" />

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-5">
          <FaWhatsapp size={48} className="text-green-600 mb-2" />
          <h2 className="text-xl font-semibold text-gray-800">
            WhatsApp Login
          </h2>
        </div>

        <input
          type="text"
          placeholder="Phone No"
          maxLength={10}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-sm"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/[^0-9]/g, ""))
          }
        />

        <button
          onClick={handleSendOTP}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition text-sm"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
