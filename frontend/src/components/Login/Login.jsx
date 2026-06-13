import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Login = () => {
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
        `${server}/user/login-user`,
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login successful!");
        navigate("/");
        window.location.reload(true);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Login failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-12">
      {/* Amazon Logo */}
      <Link to="/" className="mb-4">
        <h1 className="text-[28px] font-[800] text-[#131921] font-Poppins">
          Amazon<span className="text-[#ff9900]">.in</span>
        </h1>
      </Link>

      {/* Login Card */}
      <div className="w-[350px] border border-[#ddd] rounded-lg p-[26px] bg-white">
        <h1 className="text-[28px] font-[400] text-[#111] mb-[10px]">Sign in</h1>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-[14px]">
            <label className="block text-[13px] font-[700] text-[#111] mb-[2px]">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[31px] px-[7px] border border-[#a6a6a6] rounded-[3px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-[14px]">
            <div className="flex justify-between items-center mb-[2px]">
              <label className="text-[13px] font-[700] text-[#111]">
                Password
              </label>
              <a href="#" className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline">
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
                className="w-full h-[31px] px-[7px] pr-[35px] border border-[#a6a6a6] rounded-[3px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                placeholder="Enter your password"
              />
              {visible ? (
                <AiOutlineEye
                  className="absolute right-2 top-[6px] cursor-pointer text-[#555]"
                  size={20}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-2 top-[6px] cursor-pointer text-[#555]"
                  size={20}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[31px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[3px] text-[13px] font-[400] text-[#111] cursor-pointer hover:from-[#f5d78e] hover:to-[#eeb933] active:border-[#a88734] active:shadow-[0_0_3px_2px_rgb(228,185,106)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[12px] text-[#111] mt-[14px] leading-[1.5]">
          By continuing, you agree to Amazon's{" "}
          <span className="text-[#0066c0] cursor-pointer hover:text-[#c45500] hover:underline">
            Conditions of Use
          </span>{" "}
          and{" "}
          <span className="text-[#0066c0] cursor-pointer hover:text-[#c45500] hover:underline">
            Privacy Notice
          </span>.
        </p>

        {/* Keep signed in */}
        <div className="flex items-center mt-[14px]">
          <input
            type="checkbox"
            id="keep-signed"
            className="w-[13px] h-[13px] mr-[6px] cursor-pointer"
          />
          <label htmlFor="keep-signed" className="text-[12px] text-[#111] cursor-pointer">
            Keep me signed in.
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="w-[350px] mt-[18px] relative">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#e7e7e7]"></div>
        <p className="relative text-center text-[12px] text-[#767676] bg-white px-[8px] inline-block left-1/2 -translate-x-1/2">
          New to Amazon?
        </p>
      </div>

      {/* Create Account Button */}
      <div className="w-[350px] mt-[12px]">
        <Link to="/sign-up">
          <button className="w-full h-[31px] bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded-[3px] text-[13px] text-[#111] cursor-pointer hover:from-[#e7eaf0] hover:to-[#d9dce1]">
            Create your Amazon account
          </button>
        </Link>
      </div>

      {/* Seller Login Link */}
      <div className="w-[350px] mt-[16px] text-center">
        <Link
          to="/shop-login"
          className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline"
        >
          Sign in as a Seller →
        </Link>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-[#e7e7e7] mt-[22px] pt-[14px] bg-gradient-to-b from-[#f7f7f7] to-white">
        <div className="flex justify-center gap-[14px] text-[11px] text-[#0066c0]">
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">
            Conditions of Use
          </span>
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">
            Privacy Notice
          </span>
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">
            Help
          </span>
        </div>
        <p className="text-center text-[11px] text-[#555] mt-[4px]">
          © 2025, Amazon Second Life Commerce
        </p>
      </div>
    </div>
  );
};

export default Login;
