import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../Utils/api";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Custom popup modal state
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const triggerPopup = (title, message, onConfirm = null) => {
    setPopup({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);

      console.log(res.data);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      triggerPopup("Success", "Login Successful!", () => {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      });
    } catch (error) {
      console.log(error.response?.data);
      let errMsg = "Login Failed";
      if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errMsg = error.response.data.errors.map(err => err.msg).join(", ");
      }
      triggerPopup("Error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>

      <p className="text-slate-500 mb-8">Sign in to continue to IntellMeet</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium">Email Address</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className="w-full border rounded-xl px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border rounded-xl px-4 py-3 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 cursor-pointer"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center mt-6 text-slate-600">
        Don't have an account?
        <Link to="/register" className="text-violet-600 ml-2 font-semibold">
          Create Account
        </Link>
      </p>

      {/* Custom Popup Modal Dialog */}
      {popup.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative border border-slate-100 text-slate-900 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{popup.title}</h3>
            <p className="text-sm text-slate-550 mb-6 font-semibold">{popup.message}</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setPopup(prev => ({ ...prev, isOpen: false }));
                  if (popup.onConfirm) popup.onConfirm();
                }}
                className="px-6 py-2.5 rounded-xl text-white bg-violet-600 hover:bg-violet-750 shadow-sm transition text-sm font-semibold cursor-pointer"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
