import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import { backend_url } from "../../../server";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  return (
    <div className="w-full h-[56px] bg-[#131921] sticky top-0 left-0 z-30 flex items-center justify-between px-5 shadow-lg">
      {/* Left: Logo + Branding */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <h1 className="text-[18px] font-[800] text-white font-Poppins">
            Amazon<span className="text-[#ff9900]">.in</span>
          </h1>
          <span className="text-[12px] text-gray-400 border-l border-gray-600 pl-3 hidden 800px:block">
            Seller Central
          </span>
        </Link>
      </div>

      {/* Center: Quick Nav */}
      <div className="hidden 800px:flex items-center gap-1">
        <Link
          to="/dashboard"
          className="px-3 py-1.5 text-[12px] text-gray-300 hover:text-white hover:bg-[#232f3e] rounded transition"
        >
          Dashboard
        </Link>
        <Link
          to="/dashboard-orders"
          className="px-3 py-1.5 text-[12px] text-gray-300 hover:text-white hover:bg-[#232f3e] rounded transition"
        >
          Orders
        </Link>
        <Link
          to="/dashboard-products"
          className="px-3 py-1.5 text-[12px] text-gray-300 hover:text-white hover:bg-[#232f3e] rounded transition"
        >
          Inventory
        </Link>
        <Link
          to="/dashboard-create-product"
          className="px-3 py-1.5 text-[12px] text-[#ff9900] hover:text-white hover:bg-[#232f3e] rounded transition font-[500]"
        >
          + Add Product
        </Link>
      </div>

      {/* Right: Icons + Profile */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard-messages"
          className="relative p-2 text-gray-300 hover:text-white transition"
          title="Messages"
        >
          <BiMessageSquareDetail size={20} />
        </Link>
        <Link
          to="/dashboard-events"
          className="relative p-2 text-gray-300 hover:text-white transition hidden 800px:block"
          title="Events"
        >
          <MdOutlineLocalOffer size={20} />
        </Link>
        <Link
          to="/dashboard-coupouns"
          className="relative p-2 text-gray-300 hover:text-white transition hidden 800px:block"
          title="Coupons"
        >
          <AiOutlineGift size={20} />
        </Link>

        {/* Divider */}
        <div className="w-[1px] h-[28px] bg-gray-600 mx-1 hidden 800px:block"></div>

        {/* Seller Profile */}
        <Link
          to={`/shop/${seller?._id}`}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#232f3e] transition"
        >
          <img
            src={`${backend_url}${seller?.avatar}`}
            alt="Shop"
            className="w-[32px] h-[32px] rounded-full object-cover border-2 border-[#ff9900]"
          />
          <div className="hidden 800px:block">
            <p className="text-[11px] text-gray-400 leading-tight">Your Shop</p>
            <p className="text-[12px] text-white font-[500] leading-tight truncate max-w-[100px]">
              {seller?.name}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
