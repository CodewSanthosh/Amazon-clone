import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios
      .post(
        `${server}/shop/login-shop`,
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login successful!");
        navigate("/dashboard");
        window.location.reload(true);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Login failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Top Bar */}
      <div className="w-full bg-[#131921] h-[60px] flex items-center px-6">
        <Link to="/">
          <h1 className="text-[22px] font-[800] text-white font-Poppins">
            Amazon<span className="text-[#ff9900]">.in</span>
            <span className="text-[14px] font-[400] text-gray-300 ml-2">Seller Central</span>
          </h1>
        </Link>
      </div>

      <div className="flex flex-col items-center pt-10 pb-12">
        {/* Login Card */}
        <div className="w-[400px] bg-white border border-[#ddd] rounded-lg shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#232f3e] to-[#131921] px-6 py-5">
            <h1 className="text-[22px] font-[500] text-white">Seller Sign In</h1>
            <p className="text-[13px] text-gray-300 mt-1">
              Access your Seller Central dashboard
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-[16px]">
                <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[36px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                  placeholder="seller@example.com"
                />
              </div>

              {/* Password */}
              <div className="mb-[16px]">
                <div className="flex justify-between items-center mb-[4px]">
                  <label className="text-[13px] font-[700] text-[#111]">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[36px] px-[10px] pr-[40px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                    placeholder="Enter your password"
                  />
                  {visible ? (
                    <AiOutlineEye
                      className="absolute right-3 top-[8px] cursor-pointer text-[#555]"
                      size={20}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute right-3 top-[8px] cursor-pointer text-[#555]"
                      size={20}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
              </div>

              {/* Keep signed in */}
              <div className="flex items-center mb-[18px]">
                <input
                  type="checkbox"
                  id="keep-signed"
                  className="w-[14px] h-[14px] mr-[7px] cursor-pointer accent-[#ff9900]"
                />
                <label
                  htmlFor="keep-signed"
                  className="text-[12px] text-[#111] cursor-pointer"
                >
                  Keep me signed in
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[38px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[14px] font-[500] text-[#111] cursor-pointer hover:from-[#f5d78e] hover:to-[#eeb933] active:shadow-[0_0_3px_2px_rgb(228,185,106)] disabled:opacity-50 transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Terms */}
            <p className="text-[11px] text-[#555] mt-[14px] leading-[1.5]">
              By signing in, you agree to Amazon Seller Central's{" "}
              <span className="text-[#0066c0] cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-[#0066c0] cursor-pointer hover:underline">
                Business Solutions Agreement
              </span>.
            </p>
          </div>

          {/* Card Footer */}
          <div className="bg-[#f7f7f7] border-t border-[#e7e7e7] px-6 py-4">
            <p className="text-[13px] text-[#111]">
              New to Amazon Seller?{" "}
              <Link
                to="/shop-create"
                className="text-[#0066c0] font-[500] hover:text-[#c45500] hover:underline"
              >
                Register your business →
              </Link>
            </p>
            <p className="text-[12px] text-[#555] mt-2">
              Looking to buy?{" "}
              <Link
                to="/login"
                className="text-[#0066c0] hover:text-[#c45500] hover:underline"
              >
                Sign in as Customer
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="w-[400px] mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#e7e7e7] rounded-lg p-3 text-center">
            <span className="text-[20px]">📦</span>
            <p className="text-[11px] text-[#555] mt-1">Manage Products</p>
          </div>
          <div className="bg-white border border-[#e7e7e7] rounded-lg p-3 text-center">
            <span className="text-[20px]">📊</span>
            <p className="text-[11px] text-[#555] mt-1">Track Sales</p>
          </div>
          <div className="bg-white border border-[#e7e7e7] rounded-lg p-3 text-center">
            <span className="text-[20px]">♻️</span>
            <p className="text-[11px] text-[#555] mt-1">Second Life</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-[#e7e7e7] py-4 bg-white">
        <div className="flex justify-center gap-[16px] text-[11px] text-[#0066c0]">
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">Terms</span>
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">Privacy</span>
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">Help</span>
        </div>
        <p className="text-center text-[11px] text-[#555] mt-[4px]">
          © 2025, Amazon Second Life Commerce — Seller Central
        </p>
      </div>
    </div>
  );
};

export default ShopLogin;
