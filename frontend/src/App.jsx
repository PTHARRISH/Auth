import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ImageUploadPage from "./pages/ImageUploadPage";
import LoginPage from "./pages/LoginPage";
import SendOtpPage from "./pages/SendOtpPage";
import SignupPage from "./pages/SignupPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="*" element={<div className="text-center">Page not found</div>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sendotp" element={<SendOtpPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/dashboard" element={<ImageUploadPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;