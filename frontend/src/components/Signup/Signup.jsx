import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const newForm = new FormData();

    if (avatar) {
      newForm.append("file", avatar);
    }
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);

    axios
      .post(`${server}/user/create-user`, newForm, config)
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar(null);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Signup failed");
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

      {/* Signup Card */}
      <div className="w-[350px] border border-[#ddd] rounded-lg p-[26px] bg-white">
        <h1 className="text-[28px] font-[400] text-[#111] mb-[10px]">
          Create account
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-[14px]">
            <label className="block text-[13px] font-[700] text-[#111] mb-[2px]">
              Your name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[31px] px-[7px] border border-[#a6a6a6] rounded-[3px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
              placeholder="First and last name"
            />
          </div>

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
            <label className="block text-[13px] font-[700] text-[#111] mb-[2px]">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[31px] px-[7px] pr-[35px] border border-[#a6a6a6] rounded-[3px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                placeholder="At least 4 characters"
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
            <p className="text-[12px] text-[#555] mt-[4px]">
              <span className="text-[#111] font-[600]">ℹ</span> Passwords must be at least 4 characters.
            </p>
          </div>

          {/* Avatar (Optional) */}
          <div className="mb-[14px]">
            <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
              Profile picture <span className="font-[400] text-[#555]">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="inline-block h-[40px] w-[40px] rounded-full overflow-hidden border border-[#ddd]">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <RxAvatar className="h-full w-full text-[#aaa]" />
                )}
              </span>
              <label
                htmlFor="file-input"
                className="px-[10px] py-[4px] bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded-[3px] text-[12px] text-[#111] cursor-pointer hover:from-[#e7eaf0] hover:to-[#d9dce1]"
              >
                Upload photo
                <input
                  type="file"
                  name="avatar"
                  id="file-input"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="sr-only"
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar(null)}
                  className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[31px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[3px] text-[13px] font-[400] text-[#111] cursor-pointer hover:from-[#f5d78e] hover:to-[#eeb933] active:shadow-[0_0_3px_2px_rgb(228,185,106)] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create your Amazon account"}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[12px] text-[#111] mt-[14px] leading-[1.5]">
          By creating an account, you agree to Amazon's{" "}
          <span className="text-[#0066c0] cursor-pointer hover:text-[#c45500] hover:underline">
            Conditions of Use
          </span>{" "}
          and{" "}
          <span className="text-[#0066c0] cursor-pointer hover:text-[#c45500] hover:underline">
            Privacy Notice
          </span>.
        </p>

        {/* Divider */}
        <div className="border-t border-[#e7e7e7] mt-[18px] pt-[14px]">
          <p className="text-[13px] text-[#111]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#0066c0] hover:text-[#c45500] hover:underline"
            >
              Sign in →
            </Link>
          </p>
        </div>

        {/* Seller Signup */}
        <div className="mt-[10px]">
          <p className="text-[13px] text-[#111]">
            Want to sell products?{" "}
            <Link
              to="/shop-create"
              className="text-[#0066c0] hover:text-[#c45500] hover:underline"
            >
              Register as a Seller →
            </Link>
          </p>
        </div>
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

export default Signup;
