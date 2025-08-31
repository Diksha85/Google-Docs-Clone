import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        navigate("/"); 
      } else {
        setErrorMsg(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="auth-card bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
         <div className="flex justify-center mb-6">
  <div className="docs-logo bg-blue-500 rounded-full p-3 shadow-md hover:shadow-lg transition-shadow">
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAZlBMVEUwhvb9//8MZ9b///8mgvYcf/Z8sPmLtvn6/P/x9/4ieOewzvt5rfgohPaPvPoUbNucwvoAY9W5z/O+1PZmofhcnvh/s/mpxPAdb9kAWdawyfEnc9sAXtfI2fYwd9zM3vnc6PmnyftqlxHlAAABQklEQVR4nO3ZYVKDMBRF4ZpSRGvECKlaRdr9b9L3yxkrOCNJ7B17vhWcIUBfH6tVaa2bFdqn9ZTiTT9FuRAmq84bZVWPelEuPE9UnTvKhZe9XpSdYKcX5cLr6QkKRNm12utFueA6vajTZ1Ajyu6rTi/q6zOoEuXC26AX5cL7oBdlJzjoRVnVqBf1eYJSUfZmGPWibBYd9aLs3T7qRdl9NepFWdWhfNTtr7XlowAAAAAA+BeqTXZVapPvr7PrfWrU9tuHr2TbDFFXmRFFFFFEXURUk1mGqFhnF1OjJKcEAACgwFfZJU8uPu5yj1O75HlKdRwmiiiiiCJqQZTgdljxt49dAgAAmJGyS0geUebE+m6pOhYaUvyxuVmqedgUikqY0ddEEUUUURcctdyxUFTV3y/Xl/qDnrJLYGkAAAAAAAD+wgdWiT/hPWfjFwAAAABJRU5ErkJggg=="
      alt="Docs Logo"
      className="w-20 h-20"
    />
  </div>
</div>
        </div>
        <h2 className="auth-title text-2xl font-semibold text-center mb-1">Sign Up</h2>
        <p className="auth-subtitle text-center text-gray-500 mb-6">
          to continue to Google Docs
        </p>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="auth-input w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`auth-button w-full bg-blue-500 text-white py-2 rounded transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-2">
          <button className="auth-social-button w-full border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
          <button className="auth-social-button w-full border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              className="w-5 h-5 mr-2"
            />
            Continue with GitHub
          </button>
        </div>

        <p className="auth-footer text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
