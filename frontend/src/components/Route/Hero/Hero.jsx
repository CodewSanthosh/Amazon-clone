import React from 'react'
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
    return (
        <div
            className="relative min-h-[70vh] 800px:min-h-[80vh] w-full flex items-center"
            style={{
                background: "linear-gradient(135deg, #232f3e 0%, #131921 40%, #1a2e1a 100%)",
            }}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-[#ff9900] rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#ff9900] rounded-full opacity-5 blur-3xl"></div>
            </div>

            <div className={`${styles.section} w-[90%] 800px:w-[70%] relative z-10`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#ff9900] text-[#131921] px-4 py-2 rounded-full text-sm font-[700] mb-6">
                    <span>♻️</span>
                    <span>Amazon Second Life Commerce — Powered by AI</span>
                </div>

                <h1 className="text-[36px] leading-[1.15] 800px:text-[56px] text-white font-[700] font-Poppins">
                    Every Product Deserves a{" "}
                    <span className="text-[#ff9900]">Second Life</span>
                </h1>

                <p className="pt-5 text-[16px] 800px:text-[18px] font-Poppins font-[400] text-gray-300 max-w-[600px] leading-relaxed">
                    AI-powered returns, smart quality grading, and intelligent routing.
                    Shop certified refurbished, earn Green Credits, and build a sustainable future — all within Amazon's trusted ecosystem.
                </p>

                {/* Stats strip */}
                <div className="flex gap-8 mt-8 mb-8">
                    <div>
                        <h3 className="text-[#ff9900] text-[24px] font-[700]">12,450+</h3>
                        <p className="text-gray-400 text-[13px]">Products Saved</p>
                    </div>
                    <div>
                        <h3 className="text-[#ff9900] text-[24px] font-[700]">5.2 Tons</h3>
                        <p className="text-gray-400 text-[13px]">CO₂ Avoided</p>
                    </div>
                    <div>
                        <h3 className="text-[#ff9900] text-[24px] font-[700]">₹23L+</h3>
                        <p className="text-gray-400 text-[13px]">Value Recovered</p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4 flex-wrap">
                    <Link to="/refurbished" className="inline-block">
                        <div className="bg-[#ff9900] hover:bg-[#e68a00] px-8 py-3 rounded-md cursor-pointer transition-all duration-200 shadow-lg">
                            <span className="text-[#131921] font-Poppins text-[16px] font-[700]">
                                Shop Refurbished
                            </span>
                        </div>
                    </Link>
                    <Link to="/return-portal" className="inline-block">
                        <div className="border-2 border-[#ff9900] hover:bg-[#ff9900] px-8 py-3 rounded-md cursor-pointer transition-all duration-200 group">
                            <span className="text-[#ff9900] group-hover:text-[#131921] font-Poppins text-[16px] font-[700]">
                                Return a Product ♻️
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Hero
