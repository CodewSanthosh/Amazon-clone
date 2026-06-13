import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const ShopCreate = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
    newForm.append("zipCode", zipCode);
    newForm.append("address", address);
    newForm.append("phoneNumber", phoneNumber);

    axios
      .post(`${server}/shop/create-shop`, newForm, config)
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar(null);
        setZipCode("");
        setAddress("");
        setPhoneNumber("");
        navigate("/shop-login");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Registration failed");
      })
      .finally(() => setLoading(false));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Top Bar */}
      <div className="w-full bg-[#131921] h-[60px] flex items-center px-6">
        <Link to="/">
          <h1 className="text-[22px] font-[800] text-white font-Poppins">
            Amazon<span className="text-[#ff9900]">.in</span>
            <span className="text-[14px] font-[400] text-gray-300 ml-2">
              Seller Central
            </span>
          </h1>
        </Link>
      </div>

      <div className="flex flex-col items-center pt-8 pb-12 px-4">
        {/* Registration Card */}
        <div className="w-full max-w-[480px] bg-white border border-[#ddd] rounded-lg shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#232f3e] to-[#131921] px-6 py-5">
            <h1 className="text-[22px] font-[500] text-white">
              Register as a Seller
            </h1>
            <p className="text-[13px] text-gray-300 mt-1">
              Start selling on Amazon Second Life Commerce
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit}>
              {/* Shop Name */}
              <div className="mb-[14px]">
                <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                  Shop Name <span className="text-[#c45500]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[36px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                  placeholder="Your business or shop name"
                />
              </div>

              {/* Email */}
              <div className="mb-[14px]">
                <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                  Email <span className="text-[#c45500]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[36px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                  placeholder="business@example.com"
                />
              </div>

              {/* Phone & Zip Row */}
              <div className="grid grid-cols-2 gap-3 mb-[14px]">
                <div>
                  <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                    Phone <span className="text-[#c45500]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-[36px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                    Zip Code <span className="text-[#c45500]">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full h-[36px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                    placeholder="600001"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-[14px]">
                <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                  Business Address <span className="text-[#c45500]">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-[36px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                  placeholder="Street address, city, state"
                />
              </div>

              {/* Password */}
              <div className="mb-[14px]">
                <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                  Password <span className="text-[#c45500]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[36px] px-[10px] pr-[40px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                    placeholder="Minimum 6 characters"
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

              {/* Shop Logo (Optional) */}
              <div className="mb-[18px]">
                <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                  Shop Logo{" "}
                  <span className="font-[400] text-[#555]">(optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <span className="inline-block h-[44px] w-[44px] rounded-full overflow-hidden border border-[#ddd] bg-[#f7f7f7]">
                    {avatar ? (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="Shop logo"
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <RxAvatar className="h-full w-full text-[#bbb] p-1" />
                    )}
                  </span>
                  <label
                    htmlFor="shop-file-input"
                    className="px-[12px] py-[6px] bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded-[4px] text-[12px] text-[#111] cursor-pointer hover:from-[#e7eaf0] hover:to-[#d9dce1] transition"
                  >
                    Upload logo
                    <input
                      type="file"
                      name="avatar"
                      id="shop-file-input"
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
                className="w-full h-[38px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[14px] font-[500] text-[#111] cursor-pointer hover:from-[#f5d78e] hover:to-[#eeb933] active:shadow-[0_0_3px_2px_rgb(228,185,106)] disabled:opacity-50 transition"
              >
                {loading ? "Creating account..." : "Create Seller Account"}
              </button>
            </form>

            {/* Terms */}
            <p className="text-[11px] text-[#555] mt-[14px] leading-[1.5]">
              By registering, you agree to Amazon's{" "}
              <span className="text-[#0066c0] cursor-pointer hover:underline">
                Business Solutions Agreement
              </span>
              ,{" "}
              <span className="text-[#0066c0] cursor-pointer hover:underline">
                Seller Terms
              </span>{" "}
              and{" "}
              <span className="text-[#0066c0] cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>
          </div>

          {/* Card Footer */}
          <div className="bg-[#f7f7f7] border-t border-[#e7e7e7] px-6 py-4">
            <p className="text-[13px] text-[#111]">
              Already have a seller account?{" "}
              <Link
                to="/shop-login"
                className="text-[#0066c0] font-[500] hover:text-[#c45500] hover:underline"
              >
                Sign in →
              </Link>
            </p>
            <p className="text-[12px] text-[#555] mt-2">
              Want to buy instead?{" "}
              <Link
                to="/sign-up"
                className="text-[#0066c0] hover:text-[#c45500] hover:underline"
              >
                Create a customer account
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="w-full max-w-[480px] mt-6">
          <h3 className="text-[14px] font-[600] text-[#131921] mb-3 text-center">
            Why sell on Amazon Second Life?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#e7e7e7] rounded-lg p-4 text-center">
              <span className="text-[22px]">🌍</span>
              <p className="text-[12px] text-[#131921] font-[500] mt-1">
                Millions of Customers
              </p>
              <p className="text-[11px] text-[#555] mt-0.5">
                Reach buyers across India
              </p>
            </div>
            <div className="bg-white border border-[#e7e7e7] rounded-lg p-4 text-center">
              <span className="text-[22px]">♻️</span>
              <p className="text-[12px] text-[#131921] font-[500] mt-1">
                Sustainability
              </p>
              <p className="text-[11px] text-[#555] mt-0.5">
                AI-powered returns & resale
              </p>
            </div>
            <div className="bg-white border border-[#e7e7e7] rounded-lg p-4 text-center">
              <span className="text-[22px]">📊</span>
              <p className="text-[12px] text-[#131921] font-[500] mt-1">
                Analytics Dashboard
              </p>
              <p className="text-[11px] text-[#555] mt-0.5">
                Real-time sales data
              </p>
            </div>
            <div className="bg-white border border-[#e7e7e7] rounded-lg p-4 text-center">
              <span className="text-[22px]">💰</span>
              <p className="text-[12px] text-[#131921] font-[500] mt-1">
                Easy Payments
              </p>
              <p className="text-[11px] text-[#555] mt-0.5">
                Fast & secure payouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-[#e7e7e7] py-4 bg-white">
        <div className="flex justify-center gap-[16px] text-[11px] text-[#0066c0]">
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">
            Terms
          </span>
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">
            Privacy
          </span>
          <span className="cursor-pointer hover:text-[#c45500] hover:underline">
            Help
          </span>
        </div>
        <p className="text-center text-[11px] text-[#555] mt-[4px]">
          © 2025, Amazon Second Life Commerce — Seller Central
        </p>
      </div>
    </div>
  );
};

export default ShopCreate;
