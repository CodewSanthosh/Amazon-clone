import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="bg-white border border-[#e7e7e7] rounded-lg p-10 max-w-[500px] w-full text-center shadow-sm">
          {/* Success Icon */}
          <div className="w-[80px] h-[80px] mx-auto bg-[#e8f5e9] rounded-full flex items-center justify-center mb-5">
            <span className="text-[40px]">✓</span>
          </div>

          <h1 className="text-[24px] font-[600] text-[#131921] mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-[14px] text-[#555] mb-6">
            Thank you for your order. You'll receive a confirmation email shortly.
          </p>

          {/* Order info */}
          <div className="bg-[#f7f7f7] rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px]">🌱</span>
              <span className="text-[12px] text-[#2e7d32] font-[500]">
                Green Credits will be awarded for sustainable choices
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px]">📦</span>
              <span className="text-[12px] text-[#555]">
                Estimated delivery: 2-4 business days
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link to="/profile">
              <button className="w-full h-[38px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[13px] font-[500] text-[#131921] hover:from-[#f5d78e] hover:to-[#eeb933] transition">
                View My Orders
              </button>
            </Link>
            <Link to="/products">
              <button className="w-full h-[38px] bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded-[4px] text-[13px] text-[#111] hover:from-[#e7eaf0] hover:to-[#d9dce1] transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
