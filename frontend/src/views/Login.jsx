import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        formData
      );

      // Simpan token ke localStorage
      localStorage.setItem("token", res.data.token);

      Swal.fire({
        icon: "success",
        title: "Login Success",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/admin"); // ganti sesuai route kamu
      }, 1500);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Fail",
        text: err.response?.data?.message || "Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left section: login form */}
      <div className="flex flex-col justify-center w-full md:p-0 px-20 py-48 md:w-1/2 lg:px-20 bg-white">
        <h2 className="text-4xl font-bold mb-2">WELCOME BACK!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Enter your Credentials to access your account
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 text-base border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              {/* <a href="#" className="text-sm text-blue-600 hover:underline">
                forgot password
              </a> */}
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 text-base border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600 w-5 h-5"
              />
              <span className="ml-2 text-lg text-gray-700">
                Remember for 30 days
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-2 text-lg text-gray-400">or</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <p className="text-center text-lg text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* Right section: image */}
      <div className="md:w-1/2 bg-gray-200">
        <img
          src="img/intro-bg.png"
          alt="Login Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}