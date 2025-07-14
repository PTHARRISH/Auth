import { useEffect, useRef, useState } from "react";
import { FaDownload, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://127.0.0.1:8000/upload-image/";

export default function ImageUploadPage() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // 🚪 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    toast.success("Logged out");
    navigate("/login");
  };

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.error("Please login first.");
      navigate("/login");
    }
  }, [token, navigate]);

  // 🔄 Fetch images
  const fetchImages = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403 || res.status === 401) {
        toast.error("Unauthorized. Please login.");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setImages(data);
    } catch (error) {
      toast.error("Failed to load images.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchImages();
    }
  }, [token]);

  // 📤 Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image file");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.status === 200 && data.message === "Image already exists.") {
        toast.warning("Image already exists.");
      } else if (res.status === 201) {
        toast.success("Image uploaded successfully!");
        setFile(null); // clear state
        fileInputRef.current.value = ""; // clear UI
        fetchImages(); // reload
      } else {
        toast.error("Upload failed.");
      }
    } catch (error) {
      toast.error("Upload error.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <ToastContainer position="top-right" />

      {/* 👤 User Info + Logout */}
      <div className="absolute top-6 right-6 flex items-center gap-3 text-gray-700">
        <FaUserCircle size={20} />
        <span className="text-sm font-medium">{username}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-red-500 hover:underline"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded mt-12">
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

        <form onSubmit={handleUpload} className="flex items-center gap-4 mb-6">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </form>

        <h3 className="text-lg font-medium mb-3">Uploaded Images</h3>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Uploaded At</th>
                <th className="p-2 border">Download</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id} className="text-center">
                  <td className="p-2 border">{img.id}</td>
                  <td className="p-2 border">
                    {img.image.split("/").pop()}
                  </td>
                  <td className="p-2 border">
                    {new Date(img.uploaded_at).toLocaleString()}
                  </td>
                  <td className="p-2 border">
                    <a
                      href={`http://127.0.0.1:8000${img.image}`}
                      target="new_blank"
                      download
                      className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                      <FaDownload /> Download
                    </a>
                  </td>
                </tr>
              ))}
              {images.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No images uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
