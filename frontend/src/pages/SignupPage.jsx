import { Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/signup/";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const maxLengths = {
    username: 50,
    email: 75,
    phone: 10,
    password: 75,
  };

  const validate = () => {
    const newErrors = {};
    const { username, email, phone, password, confirmPassword } = formData;

    if (!username.trim()) newErrors.username = "Username is required.";
    else if (username.length > maxLengths.username)
      newErrors.username = "Username cannot exceed 50 characters.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (email.length > maxLengths.email)
      newErrors.email = "Email cannot exceed 75 characters.";

    if (!phone.trim()) newErrors.phone = "Phone No is required.";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone No must be exactly 10 digits.";

    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.length > maxLengths.password)
      newErrors.password = "Password cannot exceed 75 characters.";
    else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
      newErrors.password =
        "Password must be alphanumeric and include a symbol.";

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required.";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const newErrors = {};
        for (const key in data) {
          if (Array.isArray(data[key])) {
            if (key === "confirm_password") {
              newErrors.confirmPassword = data[key][0];
            } else if (key === "phone") {
              newErrors.phone = data[key][0];
            } else {
              newErrors[key] = data[key][0];
            }
          }
        }
        setErrors(newErrors);
        return;
      }

      setErrors({});
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            maxLength={maxLengths.username}
            className={`w-full p-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded`}
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            maxLength={maxLengths.email}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone No */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Phone No"
            maxLength={maxLengths.phone}
            className={`w-full p-2 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded`}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            maxLength={maxLengths.password}
            className={`w-full p-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded pr-10`}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Info size={14} /> Password must be alphanumeric & contain a symbol
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            maxLength={maxLengths.password}
            className={`w-full p-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded pr-10`}
            value={formData.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.target.value)
            }
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
