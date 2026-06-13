import React from "react";
import styles from "../../styles/styles";

const TrustBanner = () => {
  return (
    <div className="w-full py-10">
      <div className={`${styles.section}`}>
        <div className="bg-gradient-to-r from-[#fff3e0] to-[#fff8e1] rounded-2xl p-8 800px:p-12 flex flex-col 800px:flex-row items-center justify-between gap-8">
          {/* Left content */}
          <div className="800px:w-[55%]">
            <h2 className="text-[24px] 800px:text-[30px] font-[700] text-[#131921] font-Poppins mb-3">
              Amazon AI Trust Scores
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
              Every refurbished product comes with an AI-generated Health Card — 
              a digital passport showing condition grade, defect analysis, 
              authenticity verification, and suggested fair price. No more guessing.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white px-3 py-2 rounded-full text-[12px] font-medium text-[#ff9900] shadow-sm">
                🔍 AI Condition Score
              </span>
              <span className="bg-white px-3 py-2 rounded-full text-[12px] font-medium text-[#ff9900] shadow-sm">
                ✅ Verified Authenticity
              </span>
              <span className="bg-white px-3 py-2 rounded-full text-[12px] font-medium text-[#ff9900] shadow-sm">
                📋 Defect Transparency
              </span>
              <span className="bg-white px-3 py-2 rounded-full text-[12px] font-medium text-[#ff9900] shadow-sm">
                💰 Fair Price Guarantee
              </span>
            </div>
          </div>

          {/* Right - Mock Health Card */}
          <div className="800px:w-[40%]">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-[320px] mx-auto border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-[600] text-[14px] text-[#131921]">
                  AI Health Card
                </h4>
                <span className="bg-[#fff3e0] text-[#ff9900] px-2 py-1 rounded text-[11px] font-bold">
                  VERIFIED ✓
                </span>
              </div>
              
              {/* Condition gauge */}
              <div className="mb-4">
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-gray-500">Condition Score</span>
                  <span className="font-bold text-[#00a86b]">8.5/10</span>
                </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#e68a00] to-[#ff9900] rounded-full" style={{width: "85%"}}></div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Trust Score</span>
                  <span className="font-medium text-[#ff9900]">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Defects Found</span>
                  <span className="font-medium">1 minor scratch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AI Confidence</span>
                  <span className="font-medium text-[#ff9900]">97.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Suggested Price</span>
                  <span className="font-bold text-[#131921]">₹1,299</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <span className="text-[11px] text-gray-400">
                  Powered by Amazon AI • Graded Jun 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBanner;
