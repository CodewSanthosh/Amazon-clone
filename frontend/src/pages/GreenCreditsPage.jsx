import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const GreenCreditsPage = () => {
  const creditHistory = [
    { id: 1, action: "Bought Refurbished iPhone Case", credits: +30, date: "Jun 10, 2025", type: "earned" },
    { id: 2, action: "Returned Headphones (Donated)", credits: +75, date: "Jun 8, 2025", type: "earned" },
    { id: 3, action: "Return Prevention — Kept Product", credits: +20, date: "Jun 5, 2025", type: "earned" },
    { id: 4, action: "Redeemed for ₹50 Discount", credits: -100, date: "Jun 3, 2025", type: "spent" },
    { id: 5, action: "Sold via Peer-to-Peer", credits: +60, date: "May 28, 2025", type: "earned" },
  ];

  return (
    <div>
      <Header activeHeading={5} />

      {/* Page Header */}
      <div className="bg-[#131921] py-10">
        <div className={`${styles.section} text-center`}>
          <h1 className="text-[28px] 800px:text-[36px] font-[700] text-white font-Poppins">
            Green Credits 🌱
          </h1>
          <p className="text-gray-300 text-[15px] mt-2">
            Earn rewards for every sustainable choice you make
          </p>
        </div>
      </div>

      <div className={`${styles.section} py-8`}>
        <div className="grid grid-cols-1 800px:grid-cols-3 gap-6 mb-10">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#ff9900] to-[#e68a00] rounded-xl p-6 text-[#131921]">
            <h3 className="text-[14px] font-medium opacity-80">Your Balance</h3>
            <p className="text-[42px] font-[800] mt-2">185</p>
            <p className="text-[14px] font-semibold">Green Credits 🌱</p>
            <button className="mt-4 bg-[#131921] text-[#ff9900] px-4 py-2 rounded-md text-[13px] font-semibold">
              Redeem Credits
            </button>
          </div>

          {/* Impact Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[14px] font-medium text-gray-500">Your Impact</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-600">🌍 CO₂ Saved</span>
                <span className="font-bold text-[#ff9900]">3.2 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-600">📦 Products Reused</span>
                <span className="font-bold text-[#ff9900]">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-600">🚫 Returns Avoided</span>
                <span className="font-bold text-[#ff9900]">3</span>
              </div>
            </div>
          </div>

          {/* How to Earn */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[14px] font-medium text-gray-500">How to Earn</h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+30</span>
                <span className="text-gray-600">Buy refurbished products</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+75</span>
                <span className="text-gray-600">Donate usable returns</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+60</span>
                <span className="text-gray-600">Sell via peer-to-peer</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+20</span>
                <span className="text-gray-600">Avoid a predicted return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-[600] text-[16px] text-[#131921]">Credit History</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {creditHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] ${
                    item.type === "earned" ? "bg-[#fff3e0] text-[#ff9900]" : "bg-gray-100 text-gray-500"
                  }`}>
                    {item.type === "earned" ? "🌱" : "🛒"}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-[#131921]">{item.action}</p>
                    <p className="text-[11px] text-gray-400">{item.date}</p>
                  </div>
                </div>
                <span className={`font-[700] text-[14px] ${
                  item.type === "earned" ? "text-[#ff9900]" : "text-gray-500"
                }`}>
                  {item.credits > 0 ? "+" : ""}{item.credits}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GreenCreditsPage;
