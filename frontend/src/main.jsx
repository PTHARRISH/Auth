import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from './App.jsx';
import './index.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>

    <App />
    </GoogleOAuthProvider>
    <ToastContainer />
  </StrictMode>,
)