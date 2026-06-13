import React from "react";
import {
    AiFillFacebook,
    AiFillInstagram,
    AiFillYoutube,
    AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="bg-[#131921] text-white">
            {/* Top CTA Section */}
            <div className="flex flex-col 800px:flex-row items-center justify-between px-6 800px:px-12 py-8 bg-[#232f3e]">
                <h1 className="text-2xl 800px:text-3xl font-semibold mb-4 800px:mb-0 text-center 800px:text-left">
                    Join the <span className="text-[#00a86b]">Circular Economy</span>{" "}
                    <br className="hidden 800px:block" />
                    — give products a second life
                </h1>
                <div className="flex gap-3">
                    <Link to="/refurbished">
                        <button className="bg-[#ff9900] hover:bg-[#e68a00] text-[#131921] font-semibold px-5 py-2.5 rounded-md transition">
                            Shop Refurbished
                        </button>
                    </Link>
                    <Link to="/return-portal">
                        <button className="border border-[#00a86b] text-[#00a86b] hover:bg-[#00a86b] hover:text-white font-semibold px-5 py-2.5 rounded-md transition">
                            Return Portal
                        </button>
                    </Link>
                </div>
            </div>

            {/* Main Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 800px:px-12 py-12">
                {/* Brand */}
                <div>
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <span className="text-[24px] font-[700] font-Poppins text-white">
                            amazon
                        </span>
                    </Link>
                    <p className="text-[#ff9900] text-[12px] font-semibold mb-2">Second Life Commerce ♻️</p>
                    <p className="text-gray-400 text-[13px] leading-relaxed mb-4">
                        AI-powered sustainable commerce platform where every 
                        returned product finds its next best owner.
                    </p>
                    <div className="flex items-center gap-3">
                        <AiFillFacebook size={22} className="cursor-pointer text-gray-400 hover:text-[#ff9900] transition" />
                        <AiOutlineTwitter size={22} className="cursor-pointer text-gray-400 hover:text-[#ff9900] transition" />
                        <AiFillInstagram size={22} className="cursor-pointer text-gray-400 hover:text-[#ff9900] transition" />
                        <AiFillYoutube size={22} className="cursor-pointer text-gray-400 hover:text-[#ff9900] transition" />
                    </div>
                </div>

                {/* ReLife Features */}
                <div>
                    <h3 className="font-semibold text-[14px] mb-4 text-[#ff9900]">Second Life Features</h3>
                    <ul className="space-y-2">
                        <li><Link to="/refurbished" className="text-gray-400 hover:text-white text-[13px] transition">Certified Refurbished</Link></li>
                        <li><Link to="/return-portal" className="text-gray-400 hover:text-white text-[13px] transition">AI Return Portal</Link></li>
                        <li><Link to="/green-credits" className="text-gray-400 hover:text-white text-[13px] transition">Green Credits</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Product Health Cards</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Return Prediction</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="font-semibold text-[14px] mb-4 text-[#ff9900]">Company</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">About ReLife</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">How It Works</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Sustainability Report</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Careers</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-semibold text-[14px] mb-4 text-[#ff9900]">Support</h3>
                    <ul className="space-y-2">
                        <li><Link to="/faq" className="text-gray-400 hover:text-white text-[13px] transition">FAQ</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Seller Guide</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Return Policy</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Trust & Safety</Link></li>
                        <li><Link to="/" className="text-gray-400 hover:text-white text-[13px] transition">Live Chat</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-700 px-6 800px:px-12 py-4 flex flex-col 800px:flex-row items-center justify-between">
                <span className="text-gray-500 text-[12px]">
                    © 2025 Amazon Second Life Commerce | HackOn with Amazon Season 6.0
                </span>
                <div className="flex items-center gap-4 mt-2 800px:mt-0">
                    <span className="text-gray-500 text-[12px]">Terms</span>
                    <span className="text-gray-500 text-[12px]">Privacy</span>
                    <span className="text-gray-500 text-[12px]">
                        Powered by <span className="text-[#ff9900]">Amazon Bedrock AI</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
